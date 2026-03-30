import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup/app.setup';
import { config } from 'dotenv';
import { CoreConfig } from './core/core.config';
// core
import { createWriteStream } from 'fs';
import { get } from 'http';
import { initAppModule } from './init-app-module';

const result = config();
async function bootstrap() {
  const DynamicAppModule = await initAppModule();
  // создаём на основе донастроенного модуля наше приложение
  const app = await NestFactory.create(DynamicAppModule);
  // const app = await NestFactory.create(AppModule);

  const coreConfig = app.get(CoreConfig);

  appSetup(app);
  console.log('✅ Оно работает, можно пока прочитать молитву духу машины');

  await app.listen(coreConfig.port);

  const serverUrl = 'http://localhost:3003';
  // get the swagger json file (if app is running in development mode)
  if (coreConfig.isSwaggerEnabled) {
    // write swagger ui files
    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      console.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}
bootstrap();
