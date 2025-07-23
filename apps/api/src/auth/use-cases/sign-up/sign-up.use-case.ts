import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignUpCommand } from './sign-up.command';
import { IUserRepository, User } from '@ecorally/dal';
import { AuthService } from '@ecorally/shared';

@Injectable()
export class SignUpUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: SignUpCommand) {
    try {
      const hashedPassword = await bcrypt.hash(command.password, 8);

      const user = User.create({
        password: hashedPassword,
        email: command.email,
      });

      const createdUser = await this.userRepository.create(user);

      const accessToken = this.authService.createToken(createdUser.id, 'access');
      const refreshToken = this.authService.createToken(createdUser.id, 'refresh');

      return { accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }

      console.log(error);

      throw new InternalServerErrorException(
        `Failed to create an account: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
