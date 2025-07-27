import { ChatMemberRole, EnvironmentWithUserCommand } from '@ecorally/shared';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class UpdateChatMemberRoleCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  memberUserId: string;

  @IsString()
  @IsUUID()
  chatId: string;

  @IsEnum(ChatMemberRole)
  @IsString()
  newRole: ChatMemberRole;
}
