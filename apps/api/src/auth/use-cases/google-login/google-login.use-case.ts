import { Inject } from '@nestjs/common';
import { IUserRepository, User } from '@ecorally/dal';
import { GoogleLoginCommand } from './google-login.command';
import { createAccessToken, createRefreshToken } from '../../../common/utils/tokens.util';

export class GoogleLoginUseCase {
  constructor(@Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository) {}

  async execute(command: GoogleLoginCommand) {
    let user = await this.userRepository.getByEmail(command.email);

    if (!user) {
      const createUser = User.create({ email: command.email });
      user = await this.userRepository.create(createUser);
    }

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    return { accessToken, refreshToken };
  }
}
