import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { ALLOWED_IMAGE_MIMETYPES, IMAGE_PROCESS_MESSAGES, MAX_SIZE_IMAGE } from './constants/image.constants';
import { FileNotAllowedException } from './exceptions/file-not-allowed.exception';
import { FileTooBigException } from './exceptions/file-too-big.exception';
import { ImageServiceItf } from './image.service.interface';
import { ImageJobStatus } from './enums/image-job-status.enum';
import { StatusImageDto } from './dto/res/status-image.dto';
import { ImageStorageServiceItf } from './services/image-storage.service.interface';
import { ProcessedImageNotFoundException } from './exceptions/processed-image-not-found.exception';

@Injectable()
export class ImageService implements ImageServiceItf {
    constructor(@InjectQueue('imageProcessQueue') private imageQueue: Queue, @Inject('ImageStorageServiceItf') private readonly imageStorageService: ImageStorageServiceItf){}
    
    async upload(img: Express.Multer.File): Promise<StatusImageDto> {
        const jobId = randomUUID();
        if(!ALLOWED_IMAGE_MIMETYPES.includes(img.mimetype)) throw new FileNotAllowedException();
        if(MAX_SIZE_IMAGE <= img.size) throw new FileTooBigException();
        const uploadPath: string = await this.imageStorageService.upload(img, jobId); 
        const imageCompress = await this.imageQueue.add('compress', {
            jobId,
            uploadPath
        }, { 
            jobId,
            removeOnComplete: {
                age: 30 * 60
            },
            removeOnFail: {
                age: 5 * 60
            }
        });
        const state = await imageCompress.getState()
        return {
            jobId,
            status: ImageJobStatus[state],
            message: IMAGE_PROCESS_MESSAGES[state]
        }
    }

    async checkStatus(jobId: string): Promise<StatusImageDto> {
        const job = await this.imageQueue.getJob(jobId)
        if(!job) throw new ProcessedImageNotFoundException()
        const state = await job.getState()
        const message = state === 'failed' ? job.failedReason : IMAGE_PROCESS_MESSAGES[state]
        return {
            jobId,
            status: ImageJobStatus[state],
            message
        }
    }

    async download(jobId: string): Promise<StreamableFile> {
        await this.imageStorageService.exist(jobId);
        const response: StreamableFile = await this.imageStorageService.download(jobId);
        return response
    }
    
}

