import { Injectable } from "@nestjs/common";
import { DataImage, ImageProcessingServiceItf } from "./image-processing.service.interface";
import { PROCESSED_DIR, STORAGE_DIR } from "../constants/image.constants";
import { basename, join } from "path";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";
import { mkdirSync } from "fs";

const sharp = require('sharp');

@Injectable()
export class ImageProcessingService implements ImageProcessingServiceItf  {
    constructor(@InjectQueue('imageProcessQueue') private imageQueue: Queue){}
    
    async compress(data: DataImage): Promise<void> {
        const nameWithoutExt = basename(data.uploadPath).replace(/\.[^/.]+$/, "");
        const folderJobPath = join(process.cwd(), STORAGE_DIR, PROCESSED_DIR, `${data.jobId}`);
        mkdirSync(folderJobPath, { recursive: true });
        const processedPath = join(folderJobPath, `compressed-${nameWithoutExt}.webp`);
        await sharp(data.uploadPath)
            .resize({ 
                width: 1280,
                height: 1280,
                fit: 'inside'
            })
            .webp({ quality: 80 })
            .toFile(processedPath);
        
        await this.imageQueue.add('delete', {
            jobId: data.jobId,
            uploadPath: data.uploadPath,
            processedPath
        }, { delay: 10 * 60 * 1000 })
    }
}