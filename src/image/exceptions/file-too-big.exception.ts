import { CustomExceptionGen } from "src/common/exception/exception.general";


export class FileTooBigException extends CustomExceptionGen {
    constructor(message: string = "File too big. Please insert size file under 20MB") {
        super(message);
        this.name = FileTooBigException.name;
        Error.captureStackTrace(this, this.constructor)
    }
}