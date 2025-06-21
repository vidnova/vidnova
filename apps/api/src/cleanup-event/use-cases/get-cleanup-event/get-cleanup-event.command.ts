import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseCommand } from '@ecorally/shared';

export class GetCleanupEventCommand extends BaseCommand {
  @IsUUID()
  @IsNotEmpty()
  cleanupEventId: string;
}
