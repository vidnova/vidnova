import { EnvironmentWithUserCommand } from '../../../common/commands/project.command';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteCleanupEventCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  @IsNotEmpty()
  cleanupEventId: string;
}
