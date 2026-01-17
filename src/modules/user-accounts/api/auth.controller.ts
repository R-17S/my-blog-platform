import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { PasswordRecoveryDto } from './input-dto/passwordRecovery.input-dto';
import { NewPasswordDto } from './input-dto/newPassword.input-dto';
import { RegistrationConfirmationDto } from './input-dto/registrationConfirmation.input-dto';
import { EmailResendingDto } from './input-dto/emailResending.input-dto';
import { AuthService } from '../application/auth.service';
import { MeViewDto } from './view-dto/users.view-dto';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { PostRateLimitGuard } from '../guards/throttler/rateLimit-auth.guard';
import type { UserDocument } from '../domain/user.entity';
import type { Response } from 'express';
import { PasswordRecoveryCommand } from '../application/usecases/users/password-recovery.usecase';
import { NewPasswordCommand } from '../application/usecases/users/new-password.usecase';
import { ConfirmRegistrationCommand } from '../application/usecases/users/confirm-registration.usecase';
import { RegisterUserCommand } from '../application/usecases/users/register-user.usecase';
import { ResendRegistrationCommand } from '../application/usecases/users/recend-registration.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../application/usecases/login-user.usecase';

@Controller('auth')
@UseGuards(PostRateLimitGuard)
export class AuthController {
  constructor(
    //private usersService: UsersService,
    private readonly commandBus: CommandBus,
    private authService: AuthService,
    private authQueryRepository: AuthQueryRepository,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  //swagger doc
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        login: { type: 'string', example: 'login123' },
        password: { type: 'string', example: 'superpassword' },
      },
    },
  })
  async login(
    /*@Request() req: any*/
    @ExtractUserFromRequest() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    //console.log('🔥 [Controller] login called with:', user.id);
    //const { accessToken, refreshToken } = this.authService.login(user);
    const { accessToken, refreshToken } = await this.commandBus.execute<
      any,
      { accessToken: string; refreshToken: string }
    >(new LoginUserCommand(user));

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // обязательно в проде
      sameSite: 'strict',
      path: '/auth/refresh-token',
    });
    return { accessToken };
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  passwordRecovery(@Body() dto: PasswordRecoveryDto): Promise<void> {
    return this.commandBus.execute(new PasswordRecoveryCommand(dto.email));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  newPassword(@Body() dto: NewPasswordDto): Promise<void> {
    return this.commandBus.execute(
      new NewPasswordCommand(dto.newPassword, dto.recoveryCode),
    );
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  confirmRegistration(@Body() dto: RegistrationConfirmationDto): Promise<void> {
    return this.commandBus.execute(new ConfirmRegistrationCommand(dto.code));
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  registration(@Body() body: CreateUserInputDto): Promise<void> {
    console.log('🔥 [Controller] registration called with:', body);
    return this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  resendEmail(@Body() dto: EmailResendingDto): Promise<void> {
    return this.commandBus.execute(new ResendRegistrationCommand(dto.email));
  }
}
