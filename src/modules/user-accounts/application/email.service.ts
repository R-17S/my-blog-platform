import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}
  async sendRegistrationEmail(
    email: string,
    confirmationCode: string,
  ): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Confirm your registration',
      html: `
          <p>Здравствуйте!</p>
          <p>Ваш код подтверждения регистрации: <strong>${confirmationCode}</strong></p>
          <p>Если вы не регистрировались — просто проигнорируйте это письмо.</p> `,
    });
  }

  async sendRecoveryEmail(email: string, recoveryCode: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Password recovery',
      html: `
          <p>Здравствуйте!</p>
          <p>Ваш код восстановления пароля: <strong>${recoveryCode}</strong></p>
          <p>Если вы не запрашивали восстановление — просто проигнорируйте это письмо.</p> `,
    });
  }
  async sendPasswordUpdatedEmail(email: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Your password has been updated',
      template: 'password-updated', // password-updated.hbs
      context: {},
    });
  }
}
