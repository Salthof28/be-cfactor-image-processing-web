import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { CustomExceptionGen } from "../exception/exception.general";
import { FileNotAllowedException } from "src/image/exceptions/file-not-allowed.exception";
import { FileTooBigException } from "src/image/exceptions/file-too-big.exception";
import { ProcessedImageNotFoundException } from "src/image/exceptions/processed-image-not-found.exception";

@Catch(CustomExceptionGen)
export class ExceptionFilterGen implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    catch(exception: CustomExceptionGen, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        
        const ctx = host.switchToHttp();
        const res = ctx.getResponse()

        let responseBody = {
            message: 'something wrong on our side',
            error: 'internal server error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }

        if(exception instanceof FileNotAllowedException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        } else if(exception instanceof FileTooBigException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST,
            }
        } else if(exception instanceof ProcessedImageNotFoundException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.NOT_FOUND,
            }
        }

        httpAdapter.reply(res, responseBody, responseBody.statusCode)
    }
}