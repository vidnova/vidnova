import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignUpUseCase } from './use-cases/sign-up/sign-up.use-case';
import { SignUpCommand } from './use-cases/sign-up/sign-up.command';
import { SignInCommand } from './use-cases/sign-in/sign-in.command';
import { SignInUseCase } from './use-cases/sign-in/sign-in.use-case';
import { RefreshTokensUseCase } from './use-cases/refresh-tokens/refresh-tokens.use-case';
import { RefreshTokensCommand } from './use-cases/refresh-tokens/refresh-token.command';
import { ResetPasswordUseCase } from './use-cases/reset-password/reset-password.use-case';
import { ResetPasswordCommand } from './use-cases/reset-password/reset-password.command';
import { GoogleLoginUseCase } from './use-cases/google-login/google-login.use-case';
import { GoogleLoginCommand } from './use-cases/google-login/google-login.command';
import { GoogleService } from './services/google.service';
import { IApiResponse, SkipResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly googleService: GoogleService,
  ) {}

  @Post('sign-up')
  @ApiOperation({
    summary: 'Sign up a new user',
    description:
      'Creates a new user account and returns an access token. A refresh token is set as an HTTP-only cookie.',
  })
  @ApiBody({ type: SignUpDto, description: 'User sign-up data' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed up',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', description: 'JWT access token' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signUp(@Body() data: SignUpDto, @Res() res: FastifyReply): Promise<IApiResponse<void>> {
    const result = await this.signUpUseCase.execute(SignUpCommand.create(data));

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return res.send({ isSuccess: true });
  }

  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign in a user',
    description:
      'Authenticates a user and returns an access token. A refresh token is set as an HTTP-only cookie.',
  })
  @ApiBody({ type: SignInDto, description: 'User sign-in credentials' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', description: 'JWT access token' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async signIn(@Body() data: SignInDto, @Res() res: FastifyReply): Promise<IApiResponse<void>> {
    const result = await this.signInUseCase.execute(SignInCommand.create(data));

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return res.send({ isSuccess: true });
  }

  @Post('refresh-token')
  async refreshToken(@Res() res: FastifyReply, @Req() req: FastifyRequest) {
    const accessToken = req.headers['authorization'];
    const refreshToken = req.cookies.refreshToken;
    const result = await this.refreshTokensUseCase.execute(
      RefreshTokensCommand.create({ accessToken, refreshToken }),
    );

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return res.send({ isSuccess: true });
  }

  @Patch('reset-password')
  @ApiOperation({
    summary: 'Reset your own password',
    description: 'If the user has forgotten his password, he can reset it.',
  })
  @ApiBody({ type: ResetPasswordDto, description: 'Reset password data' })
  @ApiResponse({
    status: 200,
    description: 'User successfully reset his password',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Password was successfully updated',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Provided code is invalid' })
  async resetPassword(@Res() res: FastifyReply, @Body() data: ResetPasswordDto) {
    const result = await this.resetPasswordUseCase.execute(ResetPasswordCommand.create(data));

    res.send({ message: result });
  }

  @Get('google')
  @SkipResponseInterceptor()
  @Redirect()
  googleLogin() {
    const url = this.googleService.getAuthUrl();
    return { url };
  }

  @Get('google/callback')
  @SkipResponseInterceptor()
  @Redirect()
  async googleCallback(@Res() res: FastifyReply, @Query('code') code: string) {
    const user = await this.googleService.getUserData(code);

    const { accessToken, refreshToken } = await this.googleLoginUseCase.execute(
      GoogleLoginCommand.create({
        email: user.email,
      }),
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    const frontUrl = process.env.FRONT_URL || 'http://localhost:3000';
    return { url: frontUrl };
  }
}
