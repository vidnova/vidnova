import { IsEmail, IsString } from 'class-validator';
import { BaseCommand } from '@ecorally/shared';

export class SignInCommand extends BaseCommand {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
