import { IsJWT, IsOptional } from 'class-validator';
import { BaseCommand } from '@vidnova/shared';

export class RefreshTokensCommand extends BaseCommand {
  @IsOptional()
  @IsJWT()
  refreshToken?: string;

  @IsOptional()
  @IsJWT()
  accessToken?: string;
}
