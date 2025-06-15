import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseCommand } from '../../../common/commands/base.command';

export class GetCleanupEventCommand extends BaseCommand {
  @IsUUID()
  @IsNotEmpty()
  cleanupEventId: string;
}
