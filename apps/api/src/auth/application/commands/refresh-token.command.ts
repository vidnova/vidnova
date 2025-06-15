import { BaseCommand } from '../../../common/commands/base.command';
import { IsJWT, IsOptional } from 'class-validator';

export class RefreshTokensCommand extends BaseCommand {
  @IsOptional()
  @IsJWT()
  refreshToken?: string;

  @IsOptional()
  @IsJWT()
  accessToken?: string;
}
