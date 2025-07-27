import { ChatPreviewDto, ChatWithMembersPersistenceDto } from './chat.dto';
import { ChatType } from '@ecorally/shared';

export class ChatMapper {
  static toPreviewDto(chat: ChatWithMembersPersistenceDto, currentUserId: string): ChatPreviewDto {
    if (chat.type === ChatType.DIRECT) {
      const companion = chat.members.find((m) => m.user.id !== currentUserId);

      return {
        id: chat.id,
        name: companion
          ? `${companion.user.firstName} ${companion.user.lastName ?? ''}`.trim()
          : 'Unknown',
        imageUrl: companion?.user.imageUrl ?? '',
        type: chat.type,
      };
    }

    return {
      id: chat.id,
      name: chat.name ?? '',
      imageUrl: chat.imageUrl,
      type: chat.type,
    };
  }
}
