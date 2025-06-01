import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createAccessToken, createRefreshToken } from '../../../common/utils/tokens.util';
import { UserRepository } from '../../../user/domain/interfaces/user-repository.interface';
import { SignUpDto } from '../../infrastructure/dto/sign-up.dto';
import { USER_REPOSITORY } from '../../../user/tokens/user-repository.token';

@Injectable()
export class SignUpUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async execute(data: SignUpDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 8);
      const name = data.email.split('@')[0];

      const user = await this.userRepository.create({
        name,
        email: data.email,
        password: hashedPassword,
      });

      const accessToken = createAccessToken(user.getSnapshot().id);
      const refreshToken = createRefreshToken(user.getSnapshot().id);

      return { accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException(
        `Failed to create an account: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
