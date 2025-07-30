import { Injectable, NestMiddleware } from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    console.log('[logger] Object.keys(req):', Object.keys(req));
    console.log('[logger] Object.keys(res):', Object.keys(res));
    next();
    // res.send('Intercepted by logger');
  }
}
