import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ResetPasswordCommand } from './reset-password.command';
import { IUserRepository } from '@ecorally/dal';
import { IVerifyOtp } from '../../../otp/use-cases/verify-otp/verify-otp.interface';
import { VerifyOtpCommand } from '../../../otp/use-cases/verify-otp/verify-otp-command';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
    @Inject('VERIFY_OTP') private readonly otpVerifier: IVerifyOtp,
  ) {}

  async execute(command: ResetPasswordCommand) {
    try {
      const user = await this.userRepository.getByEmail(command.email);

      if (!user) {
        throw new ConflictException('Invalid data provided');
      }

      const isValidCode = await this.otpVerifier.execute(
        VerifyOtpCommand.create({
          userId: user.id,
          code: command.code,
        }),
      );
      if (!isValidCode) {
        throw new ConflictException('Invalid data provided');
      }

      const hashedPassword = await bcrypt.hash(command.password, 10);

      const updatedUser = user.updatePassword(hashedPassword);

      await this.userRepository.updatePassword(updatedUser);

      return 'Password was successfully updated';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to reset password');
    }
  }
}
