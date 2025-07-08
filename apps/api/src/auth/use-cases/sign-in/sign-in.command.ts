import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseCommand } from '@ecorally/shared';

export class SignInCommand extends BaseCommand {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
