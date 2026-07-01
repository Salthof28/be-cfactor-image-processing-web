import { Controller, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomExceptionGen } from 'src/common/exception/exception.general';
import { StatusImageDto } from './dto/res/status-image.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadImg(@UploadedFile() file: Express.Multer.File): Promise<StatusImageDto> {
    try {
      return await this.imageService.upload(file)
    } catch (error) {
      if(error instanceof CustomExceptionGen) throw error;
      throw new InternalServerErrorException()
    }
  }
}
