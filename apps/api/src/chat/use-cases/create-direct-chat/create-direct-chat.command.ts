import { BaseCommand } from '@ecorally/shared';
import { IsString, IsUUID } from 'class-validator';

export class CreateDirectChatCommand extends BaseCommand {
  @IsString()
  @IsUUID()
  initiatorId: string;

  @IsString()
  @IsUUID()
  recipientId: string;
}
