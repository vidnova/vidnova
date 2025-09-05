import { EnvironmentWithUserCommand } from '@vidnova/shared';

export class DeleteMessageForAllCommand extends EnvironmentWithUserCommand {
  messageId: string;
}
