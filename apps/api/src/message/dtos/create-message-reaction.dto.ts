import { IsEmoji } from '../../common/decorators/emoji.decorator';

export class CreateMessageReactionDto {
  @IsEmoji()
  emoji: string;
}
