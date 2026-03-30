import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './core.config';
import { AllHttpExceptionsFilter } from './exceptions/filters/all-exceptions.filter';

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  // exports: [GlobalLogerService],
  providers: [CoreConfig, AllHttpExceptionsFilter],
  exports: [CoreConfig, AllHttpExceptionsFilter],
})
export class CoreModule {}
