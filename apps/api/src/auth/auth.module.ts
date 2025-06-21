import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OtpModule } from '../otp/otp.module';
import { USE_CASES } from './use-cases';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, OtpModule],
  controllers: [AuthController],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class AuthModule {}
