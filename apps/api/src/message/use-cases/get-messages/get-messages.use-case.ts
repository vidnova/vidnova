import { IChatRepository, IMessageRepository } from '@vidnova/dal';
import { GetMessagesCommand } from './get-messages.command';
import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class GetMessagesUseCase {
  private logger = new Logger(GetMessagesUseCase.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY') private readonly messageRepository: IMessageRepository,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
  ) {}

  async execute(command: GetMessagesCommand) {
    try {
      const { userId, page, limit, chatId } = command;

      const chat = await this.chatRepository.findById(chatId, true);
      if (!chat) {
        throw new NotFoundException(`Chat with ID ${chatId} not found`);
      }

      const isUserChatMember = chat.members.find((member) => member.id === userId);
      if (!isUserChatMember) {
        throw new ForbiddenException(`The user with ID ${userId} is not a member of this chat`);
      }

      return this.messageRepository.getAllByChatId(chatId, userId, {
        page,
        limit,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('Failed to get chat messages: ', error);
      throw new InternalServerErrorException('Failed to get chat messages');
    }
  }
}
