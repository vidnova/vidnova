import { IsString, IsUUID } from 'class-validator';
import { EnvironmentWithUserCommand } from '@vidnova/shared';

export class GetChatCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  chatId: string;
}
