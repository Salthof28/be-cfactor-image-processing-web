import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { ALLOWED_IMAGE_MIMETYPES, MAX_SIZE_IMAGE } from './constants/image.constants';
import { FileNotAllowedException } from './exceptions/file-not-allowed.exception';
import { FileTooBigException } from './exceptions/file-too-big.exception';
import { extname, join } from 'path';
import { writeFile } from 'fs/promises';
import { ImageServiceItf } from './image.service.interface';
import { ImageJobStatus } from './enums/image-job-status.enum';
import { StatusImageDto } from './dto/res/status-image.dto';

@Injectable()
export class ImageService implements ImageServiceItf {
    constructor(@InjectQueue('imageProcessQueue') private imageQueue: Queue){}
    
    async upload(img: Express.Multer.File): Promise<StatusImageDto> {
        const jobId = randomUUID();
        if(!ALLOWED_IMAGE_MIMETYPES.includes(img.mimetype)) throw new FileNotAllowedException();
        if(MAX_SIZE_IMAGE <= img.size) throw new FileTooBigException();
        const filePath = join(process.cwd(), 'storage', `uploads`, `${jobId}${extname(img.originalname)}`);
        await writeFile(filePath, img.buffer);
        const dataJob = {
            jobId,
            status: ImageJobStatus.PENDING
        }
        // const imageCompress = await this.imageQueue.add('compress', dataJob, { jobId })
        return dataJob
    } 
}

