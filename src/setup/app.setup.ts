import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { AllHttpExceptionsFilter } from '../core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from '../core/exceptions/filters/domain-exceptions.filter';

export function appSetup(app: INestApplication) {
  app.enableCors();
  app.useGlobalFilters(
    new AllHttpExceptionsFilter(), // потом всё остальное
    new DomainHttpExceptionsFilter(), // сначала ловим кастомные
  );
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);
}
