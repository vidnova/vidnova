import { BaseCommand } from '../../../common/commands/base.command';
import { IsEmail, IsString } from 'class-validator';

export class SignInCommand extends BaseCommand {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
