import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OtpModule } from '../otp/otp.module';
import { USE_CASES } from './use-cases';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleService } from './services/google.service';
import { GoogleConfig } from '../../config';

@Module({
  imports: [DatabaseModule, OtpModule, ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [...USE_CASES, GoogleService, GoogleConfig],
  exports: [...USE_CASES],
})
export class AuthModule {}
