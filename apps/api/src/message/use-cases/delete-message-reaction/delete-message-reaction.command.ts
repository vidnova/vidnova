import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsUUID } from 'class-validator';

export class DeleteMessageReactionCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  messageId: string;
}
