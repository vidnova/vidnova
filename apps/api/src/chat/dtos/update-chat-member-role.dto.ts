import { IsEnum, IsString } from 'class-validator';
import { ChatMemberRole } from '@ecorally/shared';

export class UpdateChatMemberRoleDto {
  @IsString()
  @IsEnum(ChatMemberRole)
  newRole: ChatMemberRole;
}
