import { DynamicModule, Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';

const defaultConfig = {
  provide: 'commonConfig',
  useValue: { port: 3000 },
};

@Global()
@Module({
  controllers: [CommonController],
  providers: [CommonService, defaultConfig],
  exports: [CommonService, defaultConfig],
})
export class CommonModule {
  static decorate(configValue: Record<string, unknown>): DynamicModule {
    const dynamicConfig = {
      provide: 'commonConfig',
      useValue: configValue,
    };
    return {
      module: CommonModule,
      providers: [CommonService, dynamicConfig],
      exports: [CommonService, dynamicConfig],
    };
  }
}
