import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { createMainConfig } from '../../config';

@Module({
  imports: [MailerModule.forRoot(createMainConfig())],
  providers: [],
  exports: [],
})
export class MailModule {}
