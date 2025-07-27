import { EnvironmentWithUserCommand } from '@ecorally/shared';
import { IsOptional, IsString, IsUrl, IsUUID, MinLength } from 'class-validator';

export class UpdateChatInfoCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  chatId: string;

  @IsString()
  @MinLength(1)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
