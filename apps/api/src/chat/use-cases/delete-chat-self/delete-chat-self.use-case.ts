import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IChatRepository } from '@vidnova/dal';
import { DeleteChatSelfCommand } from './delete-chat-self.command';
import { ChatType } from '@vidnova/shared';

@Injectable()
export class DeleteChatSelfUseCase {
  constructor(@Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository) {}

  async execute(command: DeleteChatSelfCommand) {
    try {
      await this.validateChat(command.chatId);
      const updatedMember = await this.validateMember(command.userId, command.chatId);

      await this.chatRepository.updateChatMember(command.userId, command.chatId, updatedMember);

      return { message: 'You have successfully deleted the chat for yourself' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete chat');
    }
  }

  private async validateChat(chatId: string) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }

    if (chat.type !== ChatType.DIRECT) {
      throw new ConflictException('You can only delete direct chats for yourself');
    }
  }

  private async validateMember(userId: string, chatId: string) {
    const member = await this.chatRepository.findMemberByUserAndChatIds(userId, chatId);

    if (!member) {
      throw new NotFoundException('You are not member of this chat');
    }

    if (member.isDeleted) {
      throw new ConflictException('You are already deleted this chat');
    }

    return member.deleteChatForSelf();
  }
}
