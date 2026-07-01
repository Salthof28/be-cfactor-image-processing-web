import { StreamableFile } from "@nestjs/common"

export interface ImageStorageServiceItf {
    upload(img: Express.Multer.File, jobId: string): Promise<string>
    delete(data: DataDelete): Promise<void>
    exist(jobId: string): Promise<void>
    download(jobId: string): Promise<StreamableFile>
}
export interface DataDelete {
    jobId: string,
    uploadPath: string,
    processedPath: string
}