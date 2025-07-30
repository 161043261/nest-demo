import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

interface DetailedErrMsg {
  message: string[];
}

@Catch()
export class ErrFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<ExpressRequest>();
    const resp = ctx.getResponse<ExpressResponse>();
    // const statusCode = exception.getStatus();
    const statusCode = exception.getStatus?.() ?? HttpStatus.BAD_REQUEST;
    resp.status(statusCode).json({
      timestamp: Date.now(),
      cause: exception.cause,
      statusCode,
      reqUrl: req.url,
      errMsg: exception.message,
      // detailedErrMsg 包含全局字段校验管道的错误消息
      detailedErrMsg:
        (Reflect.get(exception, 'response') as DetailedErrMsg | undefined)
          ?.message ?? [],
      errName: exception.name,
      errStack: exception.stack,
    });
  }
}
