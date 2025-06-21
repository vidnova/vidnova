import { MailerOptions } from '@nestjs-modules/mailer';
import * as process from 'node:process';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const createMainConfig = (): MailerOptions => ({
  transport: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER || '',
      pass: process.env.NODEMAILER_PASS || '',
    },
  },
  defaults: {
    from: '"No Reply" <noreply@example.com>',
  },
  template: {
    dir: join(process.cwd(), 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
