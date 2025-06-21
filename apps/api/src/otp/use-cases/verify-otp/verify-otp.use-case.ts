import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IVerifyOtp } from './verify-otp.interface';
import * as bcrypt from 'bcrypt';
import { IOtpRepository } from '@ecorally/dal';
import { VerifyOtpCommand } from './verify-otp-command';

@Injectable()
export class VerifyOtpUseCase implements IVerifyOtp {
  constructor(@Inject('OTP_REPOSITORY') private readonly otpRepository: IOtpRepository) {}

  async execute(command: VerifyOtpCommand): Promise<boolean> {
    try {
      const userOtp = await this.otpRepository.getByUserId(command.userId);

      if (!userOtp) throw new NotFoundException('Your OTP not found.');

      const isUserOtpExpired = Date.now() - userOtp.createdAt.getTime() >= 10 * 60 * 1000;

      if (isUserOtpExpired) {
        await this.otpRepository.delete(userOtp.id);
        throw new ConflictException('OTP expired.');
      }

      const isValid = await bcrypt.compare(command.code.toString(), userOtp.code);

      if (!isValid) {
        throw new ConflictException('Invalid data provided');
      }

      await this.otpRepository.delete(userOtp.id);

      return isValid;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        `Failed to verify OTP: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
