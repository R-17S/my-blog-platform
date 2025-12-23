import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email.module';
import { UserAccountsModule } from './user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './domain/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),
    UserAccountsModule,
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserEntity }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthQueryRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
