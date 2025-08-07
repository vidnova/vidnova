import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsUUID } from 'class-validator';

export class DeleteChatSelfCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  chatId: string;
}
