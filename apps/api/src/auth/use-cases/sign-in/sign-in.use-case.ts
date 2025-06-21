import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../../../common/utils/tokens.util';
import { SignInCommand } from './sign-in.command';
import { IUserRepository } from '@ecorally/dal';

@Injectable()
export class SignInUseCase {
  constructor(@Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository) {}

  async execute(command: SignInCommand) {
    try {
      const user = await this.userRepository.getByEmail(command.email);

      if (!user) {
        throw new NotFoundException('Invalid data provided');
      }

      const isPasswordValid = await bcrypt.compare(command.password, user.password);
      if (!isPasswordValid) {
        throw new ConflictException('Invalid data provided');
      }

      const accessToken = createAccessToken(user.id);
      const refreshToken = createRefreshToken(user.id);

      return { accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to sign-in; ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
