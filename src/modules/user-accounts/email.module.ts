import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './application/email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'gmtest809@gmail.com',
          pass: 'ahizswcsgwcyzrhd',
        },
        //logger: true, // ← логирование SMTP
        //debug: true, // ← подробные SMTP-логи
      },
      defaults: {
        from: '"My App" <no-reply@myapp.com>',
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
