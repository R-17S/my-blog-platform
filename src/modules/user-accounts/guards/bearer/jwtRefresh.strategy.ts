import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserCookiesDto } from '../dto/user-cookies.dto';
import { AuthService } from '../../application/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    //@Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: 'refresh-token-secret',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: UserCookiesDto,
  ): Promise<UserCookiesDto> {
    //const token = req.cookies?.refreshToken;
    console.log('🔥 [Strategy] cookies:', req.cookies);
    console.log('🔥 [Strategy] payload:', payload);
    await this.authService.checkRefreshToken(payload.deviceId, payload.iat);
    // payload содержит id и deviceId
    //return { payload, token };
    return payload;
  }
}
