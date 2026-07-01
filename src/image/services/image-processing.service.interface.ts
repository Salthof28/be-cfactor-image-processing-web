import { Job } from "bullmq";

export interface ImageProcessingServiceItf {
    compress(data: DataImage): Promise<void>
}

export interface DataImage {
    jobId: string,
    uploadPath: string
}