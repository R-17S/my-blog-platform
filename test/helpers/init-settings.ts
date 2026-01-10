import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

// пример: моки для сервисов

import { appSetup } from '../../src/setup/app.setup';
import { EmailService } from '../../src/modules/user-accounts/application/email.service';
import { EmailServiceMock } from '../mock/email-service.mock';
import { deleteAllData } from './delete-all-data';
import { AppModule } from '../../src/app.module';
import { UsersTestManager } from './users-test-manager';

export const initSettings = async (
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  let moduleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  // ✅ подмена EmailService на мок
  moduleBuilder = moduleBuilder
    .overrideProvider(EmailService)
    .useClass(EmailServiceMock);

  // ✅ если нужно, можно добавить кастомные override
  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(moduleBuilder);
  }

  let app;
  try {
    const testingAppModule = await moduleBuilder.compile();
    app = testingAppModule.createNestApplication();

    console.log('🔥 INIT: calling appSetup...');
    appSetup(app);

    console.log('🔥 INIT: calling app.init()...');
    await app.init();

    console.log('🔥 INIT: app.init() completed successfully');
  } catch (e) {
    console.error('❌ ERROR DURING APP INIT:', e);
    throw e;
  }

  try {
    console.log('🔥 INIT: cleaning database...');
    await deleteAllData(app);
    console.log('🔥 INIT: database cleaned');
  } catch (e) {
    console.error('❌ ERROR DURING DB CLEAN:', e);
    throw e;
  }

  return {
    app,
    httpServer: app.getHttpServer(),
    userTestManager: new UsersTestManager(app),
  };
};
