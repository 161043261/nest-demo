import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { UploadModule } from './upload/upload.module';
import { LoginModule } from './login/login.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpModule } from './emp/emp.module';
import { PeopleModule } from './people/people.module';

@Module({
  imports: [
    UserModule,
    CommonModule.decorate({ port: 3001 }),
    UploadModule,
    LoginModule,
    EmpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'whoami',
      password: 'pass',
      database: 'db0',
      retryDelay: 500,
      retryAttempts: 3,
      // entities: [join(__dirname, './**/*.entity{.js,.ts}')],
      autoLoadEntities: true, // 自动加载 entity
      synchronize: true, // 自动将 entity 同步到数据库
    }),
    PeopleModule,
  ],
  controllers: [AppController],
  // providers: [AppService],
  providers: [
    {
      provide: 'MyAppService',
      useClass: AppService,
    },
  ],
})
export class AppModule {}
