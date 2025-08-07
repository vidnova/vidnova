import { IsEnum, IsString } from 'class-validator';
import { ChatMemberRole } from '@vidnova/shared';

export class UpdateChatMemberRoleDto {
  @IsString()
  @IsEnum(ChatMemberRole)
  newRole: ChatMemberRole;
}
