import { IChatRepository, RedisService } from '@ecorally/dal';
import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateChatInfoCommand } from './update-chat-info.command';
import { ChatMemberRole, ChatType } from '@ecorally/shared';

@Injectable()
export class UpdateChatInfoUseCase {
  constructor(
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: UpdateChatInfoCommand) {
    try {
      const cacheKey = `chat:${command.chatId}:with-members`;

      const chat = await this.getChatOrThrow(command.chatId);
      const member = await this.getMemberOrThrow(command.userId, command.chatId);

      this.assertUserCanEditChat(member.role);

      const updatedChat = chat.update({
        imageUrl: command.imageUrl,
        name: command.name,
        description: command.description,
      });

      await this.redisService.delete(cacheKey);

      return this.chatRepository.updateChat(updatedChat);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update chat info');
    }
  }

  private async getChatOrThrow(chatId: string) {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (chat.type === ChatType.DIRECT) {
      throw new ConflictException('You cannot change data of the direct chat');
    }
    return chat;
  }

  private async getMemberOrThrow(userId: string, chatId: string) {
    const member = await this.chatRepository.findMemberByUserAndChatIds(userId, chatId);
    if (!member) {
      throw new ForbiddenException('You are not member of this chat');
    }
    return member;
  }

  private assertUserCanEditChat(role: ChatMemberRole) {
    const isNotAllowed = role !== ChatMemberRole.OWNER && role !== ChatMemberRole.ADMIN;
    if (isNotAllowed) {
      throw new ForbiddenException('You have no access to change chat info');
    }
  }
}
