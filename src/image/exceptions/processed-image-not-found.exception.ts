import { CustomExceptionGen } from "src/common/exception/exception.general";


export class ProcessedImageNotFoundException extends CustomExceptionGen {
    constructor(message: string = "Processed image not found") {
        super(message);
        this.name = ProcessedImageNotFoundException.name;
        Error.captureStackTrace(this, this.constructor)
    }
}