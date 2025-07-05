import { RefreshTokensUseCase } from './refresh-tokens/refresh-tokens.use-case';
import { ResetPasswordUseCase } from './reset-password/reset-password.use-case';
import { SignInUseCase } from './sign-in/sign-in.use-case';
import { SignUpUseCase } from './sign-up/sign-up.use-case';
import { GoogleLoginUseCase } from './google-login/google-login.use-case';

export const USE_CASES = [
  RefreshTokensUseCase,
  ResetPasswordUseCase,
  SignInUseCase,
  SignUpUseCase,
  GoogleLoginUseCase,
];
