import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
// 方法装饰器
// Usage: @SetRoles('admin', 'user')
export const SetRoles = (...args: string[]) => SetMetadata('roles', args);

// 参数装饰器
// Usage: @ReqUrl('yourData')
export const ReqUrl = createParamDecorator((data, context) => {
  console.log('[reqUrl] data:', data); // myData
  const ctx = context.switchToHttp();
  const req = ctx.getRequest<ExpressRequest>();
  return req.url; // /login/1?role=user
});
