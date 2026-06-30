export class CustomExceptionGen extends Error {
    constructor(message: string = 'custom exception') {
        super(message);
        this.name = CustomExceptionGen.name;
        Error.captureStackTrace(this, this.constructor)
    }
}