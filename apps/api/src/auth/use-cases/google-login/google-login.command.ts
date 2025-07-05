import { BaseCommand } from '@ecorally/shared';
import { IsEmail } from 'class-validator';

export class GoogleLoginCommand extends BaseCommand {
  @IsEmail()
  email: string;
}
