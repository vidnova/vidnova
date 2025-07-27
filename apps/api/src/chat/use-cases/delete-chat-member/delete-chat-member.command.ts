import { EnvironmentWithUserCommand } from '@ecorally/shared';
import { IsString, IsUUID } from 'class-validator';

export class DeleteChatMemberCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  memberUserId: string;

  @IsString()
  @IsUUID()
  chatId: string;
}
