import { Otp } from '../entities/otp.entity';

export interface OtpRepository {
  getByUserId(userId: string): Promise<Otp | null>;
  delete(id: string): Promise<void>;
}
