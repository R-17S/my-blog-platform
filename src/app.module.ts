import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './modules/testing/testing.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/user-accounts/auth.module';
import { EmailModule } from './modules/user-accounts/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URL_LOCAL ??
        'mongodb://localhost:27017/nest-blogger-platform',
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    ThrottlerModule.forRoot([{ ttl: 10, limit: 5 }]), // окно в секундах // максимум запросов
    BloggersPlatformModule,
    UserAccountsModule,
    AuthModule,
    EmailModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// console.log('✅ Оно работает, можно пока прочитать молитву духу машины');
