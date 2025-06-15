import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from '../../../user/domain/interfaces/user-repository.interface';
import { VerifyOtp } from '../../../otp/domain/interfaces/verify-otp.interface';
import bcrypt from 'bcrypt';
import { ResetPasswordCommand } from '../commands/reset-password.command';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
    @Inject('VERIFY_OTP') private readonly otpVerifier: VerifyOtp,
  ) {}

  async execute(command: ResetPasswordCommand) {
    try {
      const user = await this.userRepository.getByEmail(command.email);

      if (!user) {
        throw new ConflictException('Invalid data provided');
      }

      const isValidCode = await this.otpVerifier.verifyOtp(user.id, command.code);
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
