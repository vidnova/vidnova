import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

export interface IApiResponse<T> {
  isSuccess: boolean;
  data?: T;
}

const SKIP_INTERCEPTOR = 'skipResponseInterceptor';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const skip = this.reflector.get<boolean>(SKIP_INTERCEPTOR, context.getHandler());
    if (skip) return next.handle();

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

export const SkipResponseInterceptor = () => SetMetadata(SKIP_INTERCEPTOR, true);
