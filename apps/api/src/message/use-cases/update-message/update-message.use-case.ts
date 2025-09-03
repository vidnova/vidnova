import { ChatMember, IChatRepository, IMessageRepository } from '@vidnova/dal';
import {
  ForbiddenException,
  GoneException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMessageCommand } from './update-message.command';
import { BullMqService, JobTypes, QueueNames } from '@vidnova/shared';

@Injectable()
export class UpdateMessageUseCase {
  private readonly MAX_ALLOWED_TIME = 7 * 24 * 60 * 60 * 1000;
  private readonly logger = new Logger(UpdateMessageUseCase.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY') private readonly messageRepository: IMessageRepository,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    private readonly bullMqService: BullMqService,
  ) {}

  async execute(command: UpdateMessageCommand) {
    try {
      const message = await this.findMessageOrThrow(command.messageId);
      const chat = await this.findChatOrThrow(message.chatId);

      this.validateUserAccess(command.userId, message.sender.id, chat.members);
      this.validateMessageTime(message.createdAt);

      const messageWithUpdatedContent = message.update(command.content);
      const updatedMessage = await this.messageRepository.updateMessage(messageWithUpdatedContent);

      await this.bullMqService.addJob(QueueNames.MESSAGE_QUEUE, JobTypes.UPDATE_MESSAGE, {
        queueName: QueueNames.MESSAGE_QUEUE,
        jobType: JobTypes.UPDATE_MESSAGE,
        payload: updatedMessage,
      });

      return updatedMessage;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('Failed to update message: ', error);
      throw new InternalServerErrorException('Failed to update message');
    }
  }

  private async findMessageOrThrow(messageId: string) {
    const message = await this.messageRepository.findMessageById(messageId);
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    return message;
  }

  private async findChatOrThrow(chatId: string) {
    const chat = await this.chatRepository.findById(chatId, true);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    return chat;
  }

  private validateUserAccess(userId: string, senderId: string, members: ChatMember[]) {
    const isUserChatMember = members.find((member) => member.id === userId);
    if (!isUserChatMember) {
      throw new ForbiddenException('You are not member of this chat');
    }

    if (userId !== senderId) {
      throw new ForbiddenException('You have no access to change this content');
    }
  }

  private validateMessageTime(createdAt: Date) {
    const isAllowedTimeToChangeExpired = Date.now() - createdAt.getTime() > this.MAX_ALLOWED_TIME;
    if (isAllowedTimeToChangeExpired) {
      throw new GoneException('Time has passed to change this content');
    }
  }
}
