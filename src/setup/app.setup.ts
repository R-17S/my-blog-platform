import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';

export function appSetup(app: INestApplication) {
  app.use(cookieParser());
  app.enableCors();
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);
}
