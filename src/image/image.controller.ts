import { Controller, Get, Inject, InternalServerErrorException, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomExceptionGen } from 'src/common/exception/exception.general';
import { StatusImageDto } from './dto/res/status-image.dto';
import { ImageServiceItf } from './image.service.interface';
import { TransformRes } from 'src/common/interceptors/transform-body-response.interceptor';

@Controller('image')
export class ImageController {
  constructor(@Inject('ImageServiceItf') private readonly imageService: ImageServiceItf) {}
  @TransformRes(StatusImageDto)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadImg(@UploadedFile() file: Express.Multer.File): Promise<StatusImageDto> {
    try {
      const response: StatusImageDto = await this.imageService.upload(file);
      return response;
    } catch (error) {
      if(error instanceof CustomExceptionGen) throw error;
      throw new InternalServerErrorException(error.message)
    }
  }
  @TransformRes(StatusImageDto)
  @Get(':jobId')
  async getStatus(@Param('jobId') jobId: string): Promise<StatusImageDto> {
    try{
      const response: StatusImageDto = await this.imageService.checkStatus(jobId);
      return response;
    } catch (error) {
      if(error instanceof CustomExceptionGen) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':jobId/download')
  async getDonwload(@Param('jobId') jobId: string): Promise<StreamableFile> {
    try{
      const response: StreamableFile = await this.imageService.download(jobId);
      return response;
    } catch (error) {
      if(error instanceof CustomExceptionGen) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
