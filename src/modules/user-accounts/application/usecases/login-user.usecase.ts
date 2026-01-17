import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constans/auth-tokens.inject-constants';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../../domain/user.entity';
import { randomUUID } from 'node:crypto';

export class LoginUserCommand {
  constructor(public readonly user: UserDocument) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase
  implements
    ICommandHandler<
      LoginUserCommand,
      { accessToken: string; refreshToken: string }
    >
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,

    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {}

  async execute({
    user,
  }: LoginUserCommand): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.accessTokenContext.sign({
      id: user._id.toString(),
      login: user.login,
    });

    const refreshToken = this.refreshTokenContext.sign({
      id: user._id.toString(),
      deviceId: randomUUID(),
    });

    console.log('refreshToken', refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
