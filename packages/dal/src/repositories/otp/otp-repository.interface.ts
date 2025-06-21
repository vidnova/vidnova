import { Otp } from './otp.entity';

export interface IOtpRepository {
  getByUserId(userId: string): Promise<Otp | null>;

  delete(id: string): Promise<void>;

  replaceUserOtp(userId: string, hashedOtp: string): Promise<void>;
}
