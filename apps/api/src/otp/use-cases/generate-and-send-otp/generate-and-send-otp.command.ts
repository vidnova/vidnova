import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseCommand } from '@ecorally/shared';

export class GenerateAndSendOtpCommand extends BaseCommand {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
