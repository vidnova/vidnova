import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OtpModule } from '../otp/otp.module';
import { USE_CASES } from './use-cases';
import { ConfigModule } from '@nestjs/config';
import { GoogleService } from './services/google.service';
import { GoogleConfig } from '../../config';

@Global()
@Module({
  imports: [OtpModule, ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [...USE_CASES, GoogleService, GoogleConfig],
  exports: [...USE_CASES],
})
export class AuthModule {}
