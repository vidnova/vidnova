import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsUUID } from 'class-validator';

export class DeleteMessageSelfCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  messageId: string;
}
