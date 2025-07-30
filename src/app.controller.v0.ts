import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonService } from './common/common.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    @Inject('MyAppService') private readonly appService: AppService,
    @Inject('kun') private readonly kun: string[],
    @Inject('DecoratedAppService')
    private readonly decoratedAppService: AppService,

    private readonly commonService: CommonService,
  ) {}

  // curl http://localhost:3000
  @Get()
  getHello(): string {
    console.log('[getHello] Injected kun:', this.kun);
    console.log(
      '[getHello] Injected decoratedAppService.getHello():',
      this.decoratedAppService.getHello(),
    );
    return this.appService.getHello();
  }
}
