import { Injectable } from "@nestjs/common";
import { DataDelete, ImageStorageServiceItf } from "./image-storage.service.interface";
import { dirname, join } from "path";
import { PROCESSED_DIR, STORAGE_DIR, UPLOAD_DIR } from "../constants/image.constants";
import { access, rm, writeFile } from "fs/promises";
import { createReadStream, mkdirSync, readdirSync, ReadStream } from "fs";
import { ProcessedImageNotFoundException } from "../exceptions/processed-image-not-found.exception";


@Injectable()
export class ImageStorageService implements ImageStorageServiceItf  {
    async upload(img: Express.Multer.File, jobId: string): Promise<string> {
        const folderJobPath = join(process.cwd(), STORAGE_DIR, UPLOAD_DIR, jobId);
        mkdirSync(folderJobPath, { recursive: true });
        const uploadPath = join(folderJobPath, img.originalname);
        await writeFile(uploadPath, img.buffer);
        return uploadPath;
    }

    async delete(data: DataDelete): Promise<void> {
        await rm(dirname(data.uploadPath), { recursive: true, force: true });
        await rm(dirname(data.processedPath), { recursive: true, force: true });
    }

    async exist(jobId: string): Promise<void> {
        try {
            const processedPath = join(process.cwd(), STORAGE_DIR, PROCESSED_DIR, jobId);
            await access(processedPath)
        } catch (error) {
            throw new ProcessedImageNotFoundException();
        }

    }

    async download(jobId: string): Promise<{ stream: ReadStream; fileName: string }> {
        const processedPath = join(process.cwd(), STORAGE_DIR, PROCESSED_DIR, jobId);
        try {
            const files = readdirSync(processedPath);
            
            if (!files || files.length === 0) {
                throw new ProcessedImageNotFoundException();
            }

            const fileName: string = files[0];
            const finalProcessedPath = join(processedPath, fileName);
            return {
                stream: createReadStream(finalProcessedPath),
                fileName: fileName
            };
        } catch (error) {
            throw new ProcessedImageNotFoundException();
        }
    }
}