import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { BullModule } from '@nestjs/bullmq';
import { ImageProcessor } from './image.processor';
import { ImageProcessingService } from './services/image-processing.service';
import { ImageStorageService } from './services/image-storage.service';

@Module({
  imports: [BullModule.registerQueue({
    name: 'imageProcessQueue'
  })],
  controllers: [ImageController],
  providers: [
    { provide: 'ImageServiceItf', useClass: ImageService },
    { provide: 'ImageProcessingServiceItf', useClass: ImageProcessingService },
    { provide: 'ImageStorageServiceItf', useClass: ImageStorageService },
    ImageProcessor
  ],
})
export class ImageModule {}
