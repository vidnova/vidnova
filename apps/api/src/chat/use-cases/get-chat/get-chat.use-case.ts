import { Chat, IChatRepository, RedisService } from '@ecorally/dal';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetChatCommand } from './get-chat.command';

@Injectable()
export class GetChatUseCase {
  private readonly CACHE_TTL = 300;

  constructor(
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: GetChatCommand) {
    try {
      const cacheKey = `chat:${command.chatId}:with-members`;

      const cachedChat = await this.redisService.get(cacheKey);
      if (cachedChat) {
        return JSON.parse(cachedChat) as Chat;
      }

      const chat = await this.chatRepository.findById(command.chatId, true);

      if (chat?.isDeleted) {
        throw new BadRequestException(`Chat with ID ${command.chatId} was deleted`);
      }

      const userMember = chat.members.filter((member) => member.id === command.userId);

      if (userMember.length < 1) {
        throw new ForbiddenException('You have no access to this chat');
      }

      await this.redisService.set(cacheKey, JSON.stringify(chat), this.CACHE_TTL);

      return chat;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to get chat');
    }
  }
}
