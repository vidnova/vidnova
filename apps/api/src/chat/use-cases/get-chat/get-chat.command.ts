import { IsString, IsUUID } from 'class-validator';
import { EnvironmentWithUserCommand } from '@ecorally/shared';

export class GetChatCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  chatId: string;
}
