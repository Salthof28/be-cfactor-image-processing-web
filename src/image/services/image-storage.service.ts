import { Injectable } from "@nestjs/common";
import { DataDelete, ImageStorageServiceItf } from "./image-storage.service.interface";
import { extname, join } from "path";
import { STORAGE_DIR, UPLOAD_DIR } from "../constants/image.constants";
import { unlink, writeFile } from "fs/promises";


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
}

// for download
// return new StreamableFile(createReadStream(filePath));