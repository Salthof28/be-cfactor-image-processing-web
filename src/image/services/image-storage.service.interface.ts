
export interface ImageStorageServiceItf {
    upload(img: Express.Multer.File, jobId: string): Promise<string>
    delete(data: DataDelete): Promise<void>
}
export interface DataDelete {
    jobId: string,
    uploadPath: string,
    processedPath: string
}