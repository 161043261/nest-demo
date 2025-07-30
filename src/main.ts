import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as expressSession from 'express-session';
import { Handler as ExpressHandler } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { RespInterceptor } from './resp/resp.interceptor';
import { ErrFilter } from './err/err.filter';
import { setupSwaggerDocument } from './swagger';
// import { LoginGuard } from './login/login.guard';

const globalMiddleware: ExpressHandler = (req, res, next) => {
  console.log('[globalMiddleware] req.originalUrl:', req.originalUrl);
  next();
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    { cors: true }, // 开启跨域
  );

  // 开启 url 版本
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(
    expressSession({
      secret: '528',
      rolling: true,
      name: 'cookieKey',
      cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 60 * 24 * 7 },
    }),
  );

  // 使用全局中间件
  app.use(globalMiddleware);

  // 开启跨域
  app.enableCors();

  // 使用静态资源目录
  // http://localhost:3000/resources/example.[hash8].jpg
  app.useStaticAssets(join(__dirname, 'static'), {
    prefix: '/resources', // 必须带 /
  });

  // 使用全局响应拦截器
  app.useGlobalInterceptors(new RespInterceptor());

  // 使用全局异常过滤器
  app.useGlobalFilters(new ErrFilter());

  // 使用全局字段校验管道
  app.useGlobalPipes(new ValidationPipe());

  // 使用全局守卫
  // app.useGlobalGuards(new LoginGuard());

  setupSwaggerDocument(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
