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
import { UserRepository } from '../../../user/domain/interfaces/user-repository.interface';
import { SignInDto } from '../../infrastructure/dto/sign-in.dto';
import { USER_REPOSITORY } from '../../../user/tokens/user-repository.token';

@Injectable()
export class SignInUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async execute(data: SignInDto) {
    try {
      const user = await this.userRepository.getByEmail(data.email);

      if (!user) {
        throw new NotFoundException('Invalid data provided');
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.getSnapshot().password);
      if (!isPasswordValid) {
        throw new ConflictException('Invalid data provided');
      }

      const accessToken = createAccessToken(user.getSnapshot().id);
      const refreshToken = createRefreshToken(user.getSnapshot().id);

      return { accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to sign-in; ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
