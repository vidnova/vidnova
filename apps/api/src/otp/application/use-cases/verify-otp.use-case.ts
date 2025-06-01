import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VerifyOtp } from '../../domain/interfaces/verify-otp.interface';
import { OtpRepository } from '../../domain/interfaces/otp.repository';
import * as bcrypt from 'bcrypt';
import { OTP_REPOSITORY } from '../../../otp/tokens/otp.repository.token';

@Injectable()
export class VerifyOtpUseCase implements VerifyOtp {
  constructor(@Inject(OTP_REPOSITORY) private readonly otpRepository: OtpRepository) {}

  async verifyOtp(userId: string, otp: number): Promise<boolean> {
    try {
      const userOtp = await this.otpRepository.getByUserId(userId);

      if (!userOtp) throw new NotFoundException('Your OTP not found.');

      const isUserOtpExpired =
        Date.now() - userOtp.getSnapshot().createdAt.getTime() >= 10 * 60 * 1000;

      if (isUserOtpExpired) {
        await this.otpRepository.delete(userOtp.getSnapshot().id);
        throw new ConflictException('OTP expired.');
      }

      const isValid = await bcrypt.compare(otp.toString(), userOtp.getSnapshot().code);

      if (!isValid) {
        throw new ConflictException('Invalid data provided');
      }

      await this.otpRepository.delete(userOtp.getSnapshot().id);

      return isValid;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        `Failed to verify OTP: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
