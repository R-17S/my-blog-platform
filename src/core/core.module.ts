import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './core.config';

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  // exports: [GlobalLogerService],
  providers: [CoreConfig],
  exports: [CoreConfig],
})
export class CoreModule {}
