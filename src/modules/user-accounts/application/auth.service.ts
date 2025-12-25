import { ArgonService } from './argon2.service';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInputDto } from '../api/input-dto/users.input-dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../domain/user.entity';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';
import { EmailService } from './email.service';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private argonService: ArgonService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectModel(User.name) private readonly userModel: UserModelType,
  ) {}

  // -----------------------------
  // 1. LOGIN
  // -----------------------------
  async validateUser(
    username: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const isEmail = username.includes('@');

    const user = isEmail
      ? await this.usersRepository.findByEmail(username)
      : await this.usersRepository.findByLogin(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.argonService.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return null;
    }

    return { id: user._id.toString() };
  }

  login(userId: string) {
    const accessToken = this.jwtService.sign({ id: userId } as UserContextDto);

    return {
      accessToken,
    };
  }

  // -----------------------------
  // 2. REGISTRATION
  // -----------------------------
  async registerUser(input: CreateUserInputDto): Promise<void> {
    const [loginExists, emailExists] = await Promise.all([
      this.usersRepository.findByLogin(input.login),
      this.usersRepository.findByEmail(input.email),
    ]);

    if (loginExists)
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Login should be unique',
        extensions: [{ key: 'login', message: 'Login should be unique' }],
      });
    if (emailExists)
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email should be unique',
        extensions: [{ key: 'email', message: 'Email should be unique' }],
      });

    const passwordHash = await this.argonService.generateHash(input.password);
    const confirmationCode = randomUUID();

    const newUser = this.userModel.createForRegistration(
      input.login,
      input.email,
      passwordHash,
      confirmationCode,
    );

    await this.usersRepository.save(newUser);

    await this.emailService.sendRegistrationEmail(
      input.email,
      confirmationCode,
    );
  }

  async confirmRegistration(code: string): Promise<void> {
    const user = await this.usersRepository.findByConfirmationCode(code);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid confirmation code',
        extensions: [{ key: 'code', message: 'Invalid confirmation code' }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already confirmed',
        extensions: [{ key: 'email', message: 'Email already confirmed' }],
      });
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation code expired',
        extensions: [{ key: 'code', message: 'Confirmation code expired' }],
      });
    }

    user.emailConfirmation.isConfirmed = true;
    user.emailConfirmation.confirmationCode = null;

    await this.usersRepository.save(user);
  }

  async resendRegistrationEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return;
    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already confirmed',
        extensions: [{ key: 'email', message: 'Email already confirmed' }],
      });
    }

    const newCode = randomUUID();
    const newExpirationDate = add(new Date(), { hours: 24 });

    user.emailConfirmation.confirmationCode = newCode;
    user.emailConfirmation.expirationDate = newExpirationDate;

    await this.usersRepository.save(user);
    await this.emailService.sendRegistrationEmail(email, newCode);
  }

  // -----------------------------
  // 3. PASSWORD RECOVERY
  // -----------------------------
  async sendRecoveryCode(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return;

    const recoveryCode = randomUUID();
    const expirationDate = add(new Date(), { hours: 24 });

    user.passwordRecovery = {
      recoveryCode,
      expirationDate,
    };

    await this.usersRepository.save(user);
    await this.emailService.sendRecoveryEmail(email, recoveryCode);
  }

  async confirmPasswordRecovery(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    const user = await this.usersRepository.findByRecoveryCode(recoveryCode);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid confirmation code',
        extensions: [{ key: 'code', message: 'Invalid confirmation code' }],
      });
    }

    if (user.passwordRecovery!.expirationDate < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation code expired',
        extensions: [{ key: 'code', message: 'Confirmation code expired' }],
      });
    }

    const newHash = await this.argonService.generateHash(newPassword);

    user.passwordHash = newHash;
    user.passwordRecovery = null;

    await this.usersRepository.save(user);
  }

  // -----------------------------
  // 4. HELPERS
  // -----------------------------
  // private generateConfirmationCode(): string {
  //   return randomUUID();
  // }
  //
  // private generateRecoveryCode(): string {
  //   return randomUUID();
  // }
}
