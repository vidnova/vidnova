import { VerifyOtpUseCase } from './verify-otp/verify-otp.use-case';
import { GenerateAndSendOtpUseCase } from './generate-and-send-otp/generate-and-send-otp.use-case';

export const USE_CASES = [
  {
    provide: 'VERIFY_OTP',
    useClass: VerifyOtpUseCase,
  },
  GenerateAndSendOtpUseCase,
];
