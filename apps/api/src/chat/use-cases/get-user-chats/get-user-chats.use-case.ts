import { IChatRepository } from '@ecorally/dal';
import { GetUserChatsCommand } from './get-user-chats.command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GetUserChatsUseCase {
  constructor(@Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository) {}

  execute(command: GetUserChatsCommand) {
    try {
      return this.chatRepository.findChatsByUserId(command.userId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to get user chats');
    }
  }
}
