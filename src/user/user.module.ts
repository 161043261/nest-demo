import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggerMiddleware } from 'src/logger/logger.middleware';

@Module({
  controllers: [UserController],
  // providers: [UserService],
  providers: [
    {
      provide: 'MyUserService',
      useClass: UserService,
    },
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 作用于 UserController 中的所有请求
    // consumer.apply(LoggerMiddleware).forRoutes(UserController);

    // 只作用于 UserController 中, 路由前缀 /v1/user 的请求
    // consumer.apply(LoggerMiddleware).forRoutes('/v1/user');

    // 只作用于 UserController 中, 路由前缀 /v1/user 的 GET 请求
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '/v1/user', method: RequestMethod.GET });
  }
}
