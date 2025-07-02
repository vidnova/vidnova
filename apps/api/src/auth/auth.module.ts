import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OtpModule } from '../otp/otp.module';
import { USE_CASES } from './use-cases';
import { DatabaseModule } from '../database/database.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, OtpModule],
  controllers: [AuthController],
  providers: [...USE_CASES, GoogleStrategy, ConfigService],
  exports: [...USE_CASES],
})
export class AuthModule {}
