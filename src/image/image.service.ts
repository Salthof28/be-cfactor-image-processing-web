import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { ALLOWED_IMAGE_MIMETYPES, MAX_SIZE_IMAGE, STORAGE_DIR, UPLOAD_DIR } from './constants/image.constants';
import { FileNotAllowedException } from './exceptions/file-not-allowed.exception';
import { FileTooBigException } from './exceptions/file-too-big.exception';
import { extname, join } from 'path';
import { writeFile } from 'fs/promises';
import { ImageServiceItf } from './image.service.interface';
import { ImageJobStatus } from './enums/image-job-status.enum';
import { StatusImageDto } from './dto/res/status-image.dto';
import { ImageStorageServiceItf } from './services/image-storage.service.interface';

@Injectable()
export class ImageService implements ImageServiceItf {
    constructor(@InjectQueue('imageProcessQueue') private imageQueue: Queue, @Inject('ImageStorageServiceItf') private readonly imageStorageService: ImageStorageServiceItf){}
    
    async upload(img: Express.Multer.File): Promise<StatusImageDto> {
        const jobId = randomUUID();
        if(!ALLOWED_IMAGE_MIMETYPES.includes(img.mimetype)) throw new FileNotAllowedException();
        if(MAX_SIZE_IMAGE <= img.size) throw new FileTooBigException();
        const uploadPath = await this.imageStorageService.upload(img, jobId); 
        const imageCompress = await this.imageQueue.add('compress', {
            jobId,
            uploadPath
        }, { jobId });
        const state = await imageCompress.getState()
        return {
            jobId,
            status: this.mapJobStatus(state)
        }
    }
    
    
    private mapJobStatus(state: string): ImageJobStatus {
        switch(state) {
            case 'waiting':
                return ImageJobStatus.PENDING;
            case 'active':
                return ImageJobStatus.PROCESSING;
            case 'completed':
                return ImageJobStatus.COMPLETED;
            case 'failed':
                return ImageJobStatus.FAILED;
            default:
                throw new InternalServerErrorException(`Unsupported BullMQ state: ${state}`);
        }
    }

}

