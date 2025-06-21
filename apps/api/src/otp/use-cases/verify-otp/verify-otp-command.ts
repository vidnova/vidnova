import { IsNumber, Max, Min } from 'class-validator';
import { EnvironmentWithUserCommand } from '@ecorally/shared';

export class VerifyOtpCommand extends EnvironmentWithUserCommand {
  @IsNumber()
  @Min(100000)
  @Max(999999)
  code: number;
}
