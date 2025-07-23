import { Inject } from '@nestjs/common';
import { IUserRepository, User } from '@ecorally/dal';
import { GoogleLoginCommand } from './google-login.command';
import { AuthService } from '@ecorally/shared';

export class GoogleLoginUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: GoogleLoginCommand) {
    let user = await this.userRepository.getByEmail(command.email);

    if (!user) {
      const createUser = User.create({ email: command.email, isVerified: true });
      user = await this.userRepository.create(createUser);
    }

    const accessToken = this.authService.createToken(user.id, 'access');
    const refreshToken = this.authService.createToken(user.id, 'refresh');

    return { accessToken, refreshToken };
  }
}
