import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ResetPasswordDto } from '../../infrastructure/dto/reset-password.dto';
import { UserRepository } from '../../../user/domain/interfaces/user-repository.interface';
import { VerifyOtp } from '../../../otp/domain/interfaces/verify-otp.interface';
import { USER_REPOSITORY } from '../../../user/tokens/user-repository.token';
import { VERIFY_OTP } from '../../../otp/tokens/verify-otp.use-case.tokens';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(VERIFY_OTP) private readonly otpVerifier: VerifyOtp,
  ) {}

  async execute(data: ResetPasswordDto) {
    try {
      const user = await this.userRepository.getByEmail(data.email);

      if (!user) {
        throw new ConflictException('Invalid data provided');
      }

      const isValidCode = await this.otpVerifier.verifyOtp(user.getSnapshot().id, data.code);
      if (!isValidCode) {
        throw new ConflictException('Invalid data provided');
      }

      await this.userRepository.updatePassword(user.getSnapshot().id, data.password);

      return 'Password was successfully updated';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to reset password');
    }
  }
}
