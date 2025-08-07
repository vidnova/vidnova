import { IOtpRepository, IUserRepository } from '@vidnova/dal';
import { Inject, Injectable } from '@nestjs/common';
import { GenerateAndSendOtpCommand } from './generate-and-send-otp.command';
import bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class GenerateAndSendOtpUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: IUserRepository,
    @Inject('OTP_REPOSITORY') private readonly otpRepository: IOtpRepository,
    private readonly mailerService: MailerService,
  ) {}

  async execute(command: GenerateAndSendOtpCommand) {
    const user = await this.userRepository.getByEmail(command.email);

    if (!user) return 'Code sent if email exists';

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await this.otpRepository.replaceUserOtp(user.id, hashedOtp);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirmation Code',
      template: 'confirm-code',
      context: {
        email: user.email,
        code: otp,
      },
    });

    return { message: 'Code sent' };
  }
}
