import { CustomExceptionGen } from "src/common/exception/exception.general";


export class FileNotAllowedException extends CustomExceptionGen {
    constructor(message: string = "Invalid file extension. Only JPG, PNG, and WebP images are allowed.") {
        super(message);
        this.name = FileNotAllowedException.name;
        Error.captureStackTrace(this, this.constructor)
    }
}