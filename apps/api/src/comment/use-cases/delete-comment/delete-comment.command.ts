import { EnvironmentWithUserCommand } from '@ecorally/shared';
import { IsString, IsUUID } from 'class-validator';

export class DeleteCommentCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  commentId: string;
}
