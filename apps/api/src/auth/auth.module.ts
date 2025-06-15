import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from '../otp/otp.service';
import { RedisModule } from '../redis/redis.module';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import { RefreshTokensUseCase } from './application/use-cases/refresh-tokens.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { UserModule } from '../user/user.module';
import { OtpModule } from '../otp/otp.module';
import { VerifyOtpUseCase } from '../otp/application/use-cases/verify-otp.use-case';
import { BlacklistedTokenRepositoryImpl } from './infrastructure/repositories/blacklisted-token.repository';
import { UserRepositoryImpl } from '../user/infrastructure/repositories/user.repository';

@Module({
  imports: [RedisModule, UserModule, OtpModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    OtpService,
    SignUpUseCase,
    SignInUseCase,
    RefreshTokensUseCase,
    ResetPasswordUseCase,
    VerifyOtpUseCase,
    {
      provide: 'BLACKLISTED_TOKEN_REPOSITORY',
      useClass: BlacklistedTokenRepositoryImpl,
    },
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'VERIFY_OTP',
      useClass: VerifyOtpUseCase,
    },
  ],
})
export class AuthModule {}
