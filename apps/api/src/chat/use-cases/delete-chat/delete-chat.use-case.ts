import { IChatRepository } from '@ecorally/dal';
import { DeleteChatCommand } from './delete-chat.command';
import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ChatMemberRole, ChatType } from '@ecorally/shared';

@Injectable()
export class DeleteChatUseCase {
  constructor(@Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository) {}

  async execute(command: DeleteChatCommand) {
    try {
      const chat = await this.chatRepository.findById(command.chatId);
      if (!chat) {
        throw new NotFoundException(`Chat with ID ${command.chatId} not found`);
      }

      const member = await this.chatRepository.findMemberByUserAndChatIds(
        command.userId,
        command.chatId,
      );
      if (!member) {
        throw new NotFoundException(`User with ID ${command.userId} is not member of this chat`);
      }

      if (chat.type === ChatType.GROUP && member.role !== ChatMemberRole.OWNER) {
        throw new ForbiddenException('You have no access to delete this chat');
      }

      const updatedChat = chat.delete();

      await this.chatRepository.updateChat(updatedChat);

      return { message: 'You have successfully deleted the chat' };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to delete chat');
    }
  }
}
