import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [UserModule, CommonModule],
  controllers: [AppController],
  // providers: [AppService],
  providers: [
    // 自定义注入名 MyAppService
    {
      provide: 'MyAppService',
      useClass: AppService,
    },
    {
      // 自定义注入值 kun = ['sing', 'dance', 'rap', 'basketball']
      provide: 'kun',
      useValue: ['sing', 'dance', 'rap', 'basketball'],
    },
    {
      provide: 'DecoratedAppService',
      // inject: [AppService],
      inject: ['MyAppService'],
      // 支持异步
      async useFactory(appService: AppService) {
        return new Promise((resolve) => {
          console.log('[Debug] typeof appService', typeof appService);
          appService.getHello = function () {
            return 'I love you';
          };
          resolve(appService);
        });
      },
    },
  ],
})
export class AppModule {}
