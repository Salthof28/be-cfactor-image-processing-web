
export interface ImageStorageServiceItf {
    upload(img: Express.Multer.File, jobId: string): Promise<string>
}