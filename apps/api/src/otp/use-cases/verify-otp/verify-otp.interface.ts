import { VerifyOtpCommand } from './verify-otp-command';

export interface IVerifyOtp {
  execute(command: VerifyOtpCommand): Promise<boolean>;
}
