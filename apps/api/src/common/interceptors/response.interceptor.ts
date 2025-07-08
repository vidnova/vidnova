import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface IApiResponse<T> {
  isSuccess: boolean;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: IApiResponse<T> = { isSuccess: true };
        if (data) {
          response['data'] = data;
        }
        return response;
      }),
    );
  }
}
