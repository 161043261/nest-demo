import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonService } from './common/common.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    @Inject('MyAppService') private readonly appService: AppService,
    // 正常 inject 注入 @/common/CommonService
    private readonly commonService: CommonService,
  ) {}

  // curl http://localhost:3000
  @Get()
  getHello(): string {
    console.log(this.commonService.findAll());
    return this.appService.getHello();
  }
}
