import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseCommand } from '@vidnova/shared';

export class GetCleanupEventCommand extends BaseCommand {
  @IsUUID()
  @IsNotEmpty()
  cleanupEventId: string;
}
