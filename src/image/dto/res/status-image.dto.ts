import { Expose, Type } from "class-transformer";
import { ImageJobStatus } from "src/image/enums/image-job-status.enum";

export class StatusImageDto {
    @Expose()
    jobId: string

    @Expose()
    status: ImageJobStatus
}