import { IsNotEmpty, IsUUID } from 'class-validator';
import { EnvironmentWithUserCommand } from '@ecorally/shared';

export class DeleteCleanupEventCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  @IsNotEmpty()
  cleanupEventId: string;
}
