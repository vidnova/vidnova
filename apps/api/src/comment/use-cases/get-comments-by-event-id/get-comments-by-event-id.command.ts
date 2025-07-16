import { BaseCommand } from '@ecorally/shared';
import { IsString, IsUUID } from 'class-validator';

export class GetCommentsByEventIdCommand extends BaseCommand {
  @IsString()
  @IsUUID()
  eventId: string;
}
