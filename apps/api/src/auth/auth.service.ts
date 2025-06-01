import { Injectable } from '@nestjs/common';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import { RefreshTokensUseCase } from './application/use-cases/refresh-tokens.use-case';
import { SignUpDto } from './infrastructure/dto/sign-up.dto';
import { SignInDto } from './infrastructure/dto/sign-in.dto';
import { ResetPasswordDto } from './infrastructure/dto/reset-password.dto';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly signUpUser: SignUpUseCase,
    private readonly signInUser: SignInUseCase,
    private readonly refreshAuthTokens: RefreshTokensUseCase,
    private readonly resetUserPassword: ResetPasswordUseCase,
  ) {}

  async signUp(data: SignUpDto) {
    return this.signUpUser.execute(data);
  }

  async signIn(data: SignInDto) {
    return this.signInUser.execute(data);
  }

  async refreshToken(accessToken?: string, refreshToken?: string) {
    return this.refreshAuthTokens.execute(accessToken, refreshToken);
  }

  async resetPassword(data: ResetPasswordDto) {
    return this.resetUserPassword.execute(data);
  }
}
