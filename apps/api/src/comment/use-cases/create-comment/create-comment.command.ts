import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCommentCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  eventId: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  parentId: string | null = null;
}
