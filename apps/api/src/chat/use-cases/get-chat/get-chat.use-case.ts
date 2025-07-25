import { IChatRepository } from '@ecorally/dal';
import {
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetChatCommand } from './get-chat.command';

export class GetChatUseCase {
  constructor(@Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository) {}

  async execute(command: GetChatCommand) {
    try {
      const chat = await this.chatRepository.findById(command.chatId, true);

      const userMember = chat.members.filter((member) => member.id === command.userId);

      if (userMember.length < 1) {
        throw new ForbiddenException('You have no access to this chat');
      }

      return chat;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to get chat');
    }
  }
}
