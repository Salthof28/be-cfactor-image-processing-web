import { StreamableFile } from "@nestjs/common"
import { StatusImageDto } from "./dto/res/status-image.dto"

export interface ImageServiceItf {
    upload(img: Express.Multer.File): Promise<StatusImageDto>
    checkStatus(jobId: string): Promise<StatusImageDto>
    download(jobId: string): Promise<StreamableFile>
}