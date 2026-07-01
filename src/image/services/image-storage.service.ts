import { Injectable, StreamableFile } from "@nestjs/common";
import { DataDelete, ImageStorageServiceItf } from "./image-storage.service.interface";
import { extname, join } from "path";
import { PROCESSED_DIR, STORAGE_DIR, UPLOAD_DIR } from "../constants/image.constants";
import { access, unlink, writeFile } from "fs/promises";
import { createReadStream } from "fs";
import { ProcessedImageNotFoundException } from "../exceptions/processed-image-not-found.exception";


@Injectable()
export class ImageStorageService implements ImageStorageServiceItf  {
    async upload(img: Express.Multer.File, jobId: string): Promise<string> {
        const uploadPath = join(process.cwd(), STORAGE_DIR, UPLOAD_DIR, `${jobId}${extname(img.originalname)}`);
        await writeFile(uploadPath, img.buffer);
        return uploadPath;
    }

    async delete(data: DataDelete): Promise<void> {
        await unlink(data.uploadPath);
        await unlink(data.processedPath);
    }

    async exist(jobId: string): Promise<void> {
        try {
            const processedPath = join(process.cwd(), STORAGE_DIR, PROCESSED_DIR, `${jobId}.webp`);
            await access(processedPath)
        } catch (error) {
            throw new ProcessedImageNotFoundException();
        }

    }

    async download(jobId: string): Promise<StreamableFile> {
        const processedPath = join(process.cwd(), STORAGE_DIR, PROCESSED_DIR, `${jobId}.webp`);
        return new StreamableFile(createReadStream(processedPath));
    }
}