import { IsJWT, IsOptional } from 'class-validator';
import { BaseCommand } from '@ecorally/shared';

export class RefreshTokensCommand extends BaseCommand {
  @IsOptional()
  @IsJWT()
  refreshToken?: string;

  @IsOptional()
  @IsJWT()
  accessToken?: string;
}
