import { BaseCommand } from '@vidnova/shared';
import { IsString, IsUUID } from 'class-validator';

export class GetCommentRepliesCommand extends BaseCommand {
  @IsString()
  @IsUUID()
  parentId: string;
}
