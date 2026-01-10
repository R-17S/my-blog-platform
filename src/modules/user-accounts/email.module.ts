import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './application/email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'node:path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS2,
        },
        //logger: true, // ← логирование SMTP
        //debug: true, // ← подробные SMTP-логи
      },
      defaults: {
        from: '"My App" <no-reply@myapp.com>',
      },
      template: {
        dir: path.join(__dirname, 'templates'), // ← путь к папке с .hbs
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
