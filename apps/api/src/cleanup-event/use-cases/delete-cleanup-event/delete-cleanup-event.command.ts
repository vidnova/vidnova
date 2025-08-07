import { IsNotEmpty, IsUUID } from 'class-validator';
import { EnvironmentWithUserCommand } from '@vidnova/shared';

export class DeleteCleanupEventCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  @IsNotEmpty()
  cleanupEventId: string;
}
