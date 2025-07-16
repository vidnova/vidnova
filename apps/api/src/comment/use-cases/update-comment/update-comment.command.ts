import { EnvironmentWithUserCommand } from '@ecorally/shared';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateCommentCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  commentId: string;

  @IsString()
  @MinLength(1)
  content: string;
}
