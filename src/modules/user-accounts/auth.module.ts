import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailModule } from './email.module';
import { UserAccountsModule } from './user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './domain/user.entity';
import { RegisterUserUseCase } from './application/usecases/users/register-user.usecase';
import { ConfirmRegistrationUseCase } from './application/usecases/users/confirm-registration.usecase';
import { ResendRegistrationUseCase } from './application/usecases/users/recend-registration.usecase';
import { NewPasswordUserUseCase } from './application/usecases/users/new-password.usecase';
import { PasswordRecoveryUseCase } from './application/usecases/users/password-recovery.usecase';
import { SendRecoveryEmailHandler } from './application/event-handlers/recovery-email-requested.handler';
import { SendRegistrationEmailHandler } from './application/event-handlers/registration-email-requested.handler';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constans/auth-tokens.inject-constants';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    JwtModule,
    UserAccountsModule,
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserEntity }]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '5m' },
        });
      },
      inject: [
        /*TODO: inject configService. will be in the following lessons*/
      ],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'refresh-token-secret', //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '10m' },
        });
      },
      inject: [
        /*TODO: inject configService. will be in the following lessons*/
      ],
    },
    //
    AuthService,
    RegisterUserUseCase,
    ConfirmRegistrationUseCase,
    ResendRegistrationUseCase,
    PasswordRecoveryUseCase,
    NewPasswordUserUseCase,
    LoginUserUseCase,
    //
    AuthQueryRepository,
    LocalStrategy,
    JwtStrategy,
    //
    SendRegistrationEmailHandler,
    SendRecoveryEmailHandler,
  ],
  exports: [AuthService],
})
export class AuthModule {}
