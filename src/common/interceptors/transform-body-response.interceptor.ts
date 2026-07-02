import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs"


interface DtoConstructor {
    new (...args: any[]): {}
}

export class TransformResInterceptor implements NestInterceptor {
    constructor(private dto: DtoConstructor) {}

    intercept(context: ExecutionContext , next: CallHandler): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                return {
                    message: "success",
                    data: plainToClass(this.dto, data, { excludeExtraneousValues: true })
                }
            })
        )
    }
};

// for simple call in controller
export function TransformRes (dto: DtoConstructor) {
    return UseInterceptors(new TransformResInterceptor(dto));
}