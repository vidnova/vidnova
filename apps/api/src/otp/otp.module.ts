import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { VERIFY_OTP } from './tokens/verify-otp.use-case.tokens';
import { VerifyOtpUseCase } from './application/use-cases/verify-otp.use-case';
import { OTP_REPOSITORY } from './tokens/otp.repository.token';
import { OtpRepositoryImpl } from './infrastructure/repositories/otp.repository';

@Module({
  imports: [PrismaModule, MailModule, RedisModule],
  controllers: [OtpController],
  providers: [
    OtpService,
    {
      provide: VERIFY_OTP,
      useClass: VerifyOtpUseCase,
    },
    {
      provide: OTP_REPOSITORY,
      useClass: OtpRepositoryImpl,
    },
  ],
  exports: [VERIFY_OTP, OTP_REPOSITORY],
})
export class OtpModule {}
