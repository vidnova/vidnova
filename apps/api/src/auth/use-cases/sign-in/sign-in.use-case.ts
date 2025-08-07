import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInCommand } from './sign-in.command';
import { IUserRepository } from '@vidnova/dal';
import { AuthService } from '@vidnova/shared';

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: SignInCommand) {
    try {
      const user = await this.userRepository.getByEmail(command.email);

      if (!user || !user.password) {
        throw new BadRequestException('Invalid data provided');
      }

      const isPasswordValid = await bcrypt.compare(command.password, user.password);
      if (!isPasswordValid) {
        throw new ConflictException('Invalid data provided');
      }

      const accessToken = this.authService.createToken(user.id, 'access');
      const refreshToken = this.authService.createToken(user.id, 'refresh');

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
