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
      template: './registration', // registration.hbs
      context: { confirmationCode },
    });
  }

  async sendRecoveryEmail(email: string, recoveryCode: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Password recovery',
      template: './recovery', // recovery.hbs
      context: { recoveryCode },
    });
  }
  async sendPasswordUpdatedEmail(email: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Your password has been updated',
      template: './password-updated', // password-updated.hbs
      context: {},
    });
  }
}
