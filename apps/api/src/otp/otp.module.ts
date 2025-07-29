import { MailModule } from '../mail/mail.module';
import { OtpController } from './otp.controller';
import { USE_CASES } from './use-cases';
import { Module } from '@nestjs/common';

@Module({
  imports: [MailModule],
  controllers: [OtpController],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class OtpModule {}
