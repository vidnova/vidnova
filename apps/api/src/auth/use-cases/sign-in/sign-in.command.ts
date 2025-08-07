import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseCommand } from '@vidnova/shared';

export class SignInCommand extends BaseCommand {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
