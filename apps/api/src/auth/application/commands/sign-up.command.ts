import { BaseCommand } from '../../../common/commands/base.command';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../../../common/decorators';

export class SignUpCommand extends BaseCommand {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
