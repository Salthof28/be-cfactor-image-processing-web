import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Job } from 'bullmq'
import { ImageProcessingServiceItf } from './services/image-processing.service.interface';
import { ImageStorageServiceItf } from './services/image-storage.service.interface';

@Injectable()
@Processor('imageProcessQueue')
export class ImageProcessor extends WorkerHost {
    private readonly logger = new Logger(ImageProcessor.name);
    constructor(@Inject('ImageProcessingServiceItf') private readonly imageProcessingService: ImageProcessingServiceItf, @Inject('ImageStorageServiceItf') private readonly imageStorageService: ImageStorageServiceItf){ super() }
    async process (job: Job, token?: string): Promise<void> {
        switch(job.name) {
            case "compress":
                await this.imageProcessingService.compress(job.data);
                break;
            case "delete":
                await this.imageStorageService.delete(job.data);
                break;
            default:
                this.logger.error(`Unsupported job type "${job.name}" for job "${job.id}".`);
                throw new InternalServerErrorException('Image processing failed due to an internal error.')
        }
    }
}

