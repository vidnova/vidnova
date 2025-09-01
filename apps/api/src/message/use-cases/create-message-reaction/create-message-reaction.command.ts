import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsUUID } from 'class-validator';
import { IsEmoji } from '../../../common/decorators/emoji.decorator';

export class CreateMessageReactionCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  messageId: string;

  @IsEmoji()
  emoji: string;
}
