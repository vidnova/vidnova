import { Body, Controller, Inject, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { GenerateAndSendOtpUseCase } from './use-cases/generate-and-send-otp/generate-and-send-otp.use-case';
import { SendOtpDto } from './dtos/send-otp.dto';
import { GenerateAndSendOtpCommand } from './use-cases/generate-and-send-otp/generate-and-send-otp.command';
import { CheckOtpDto } from './dtos/check-otp.dto';
import { VerifyOtpCommand } from './use-cases/verify-otp/verify-otp-command';
import { IVerifyOtp } from './use-cases/verify-otp/verify-otp.interface';
import { User } from '@ecorally/dal';

@Controller('otp')
export class OtpController {
  constructor(
    private readonly generateAndSendOtpUseCase: GenerateAndSendOtpUseCase,
    @Inject('VERIFY_OTP') private readonly verifyOtpUseCase: IVerifyOtp,
  ) {}

  @Post('send')
  @ApiOperation({
    summary: 'Create OTP',
    description: 'Creates a one time password (OTP) for the user and sends it via email.',
  })
  @ApiResponse({
    status: 200,
    description: 'Otp was successfully generated and sent',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message text' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Access token not provided or has expired',
  })
  @ApiResponse({
    status: 400,
    description: 'Access token is not valid',
  })
  async sendOtp(@Body() data: SendOtpDto) {
    const result = await this.generateAndSendOtpUseCase.execute(
      GenerateAndSendOtpCommand.create(data),
    );

    return { message: result };
  }

  @Post('check')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Check OTP',
    description: ' Checks the one time password for the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Provided OTP is valid',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean', description: 'Is valid provided OTP' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Access token not provided or has expired',
  })
  @ApiResponse({
    status: 400,
    description: 'Access token or provided data is not valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Otp for this user not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Provided code is not valid',
  })
  async checkOtp(@Body(ValidationPipe) data: CheckOtpDto, @Req() req: FastifyRequest) {
    const user = req.user as User;
    const isValid = await this.verifyOtpUseCase.execute(
      VerifyOtpCommand.create({ userId: user.id, code: data.code }),
    );

    return { isValid };
  }
}
