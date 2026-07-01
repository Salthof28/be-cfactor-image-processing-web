import { StatusImageDto } from "./dto/res/status-image.dto"
import { ImageJobStatus } from "./enums/image-job-status.enum"

export interface ImageServiceItf {
    upload(img: Express.Multer.File): Promise<StatusImageDto>
}