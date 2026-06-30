import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [BullModule.registerQueue({
    name: 'imageProcessQueue'
  })],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
