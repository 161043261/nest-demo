import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface IRes<T> {
  data: T;
  code: number;
  message: string;
}

@Injectable()
export class RespInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IRes<T>> {
    // 前置拦截器
    console.log(
      '[respInterceptor] Object.keys(context):',
      Object.keys(context),
    );

    // controller

    // 后置拦截器
    return next.handle().pipe(
      map((item: T) => {
        console.log('[respInterceptor] rxjs');
        return {
          data: item,
          code: 200,
          message: 'OK',
        };
      }),
    );
  }
}
