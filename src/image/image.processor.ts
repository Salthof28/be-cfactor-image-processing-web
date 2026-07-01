import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Job } from 'bullmq'
import { ImageProcessingServiceItf } from './services/image-processing.service.interface';
import { ImageStorageServiceItf } from './services/image-storage.service.interface';

@Injectable()
@Processor('imageProcessQueue')
export class ImageProcessor extends WorkerHost {
    constructor(@Inject('ImageProcessingServiceItf') private readonly imageProcessingService: ImageProcessingServiceItf, @Inject('ImageStorageServiceItf') private readonly imageStorageService: ImageStorageServiceItf){ super() }
    async process (job: Job, token?: string): Promise<void> {
        switch(job.name) {
            case "compress":
                this.imageProcessingService.compress(job.data);
                break;
            case "delete":
                this.imageStorageService.delete(job.data);
                break;
            default:
                throw new InternalServerErrorException(`unknown job: ${job.name}`)
        }
    }
}

