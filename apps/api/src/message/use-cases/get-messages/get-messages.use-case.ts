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
      const chat = await this.chatRepository.findById(command.chatId, true);
      if (!chat) {
        throw new NotFoundException(`Chat with ID ${command.chatId} not found`);
      }

      const isUserChatMember = chat.members.find((member) => member.id === command.userId);
      if (!isUserChatMember) {
        throw new ForbiddenException(
          `The user with ID ${command.userId} is not a member of this chat`,
        );
      }

      return this.messageRepository.getAllByChatId(command.chatId, {
        page: command.page,
        limit: command.limit,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('Failed to get chat messages: ', error);
      throw new InternalServerErrorException('Failed to get chat messages');
    }
  }
}
