import { ChatMember, IChatRepository, IMessageRepository } from '@vidnova/dal';
import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteMessageSelfCommand } from './delete-message-self.command';
import { BullMqService, JobTypes, QueueNames } from '@vidnova/shared';

export class DeleteMessageSelfUseCase {
  private readonly logger = new Logger(DeleteMessageSelfUseCase.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY') private readonly messageRepository: IMessageRepository,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    private readonly bullMqService: BullMqService,
  ) {}

  async execute(command: DeleteMessageSelfCommand) {
    try {
      const { messageId, userId } = command;

      const message = await this.findMessageOrThrow(messageId, userId);
      const chat = await this.findChatOrThrow(message.chatId);

      this.checkIsUserChatMember(userId, chat.members);
      await this.checkIsMessageAlreadyDeletedForUser(messageId, userId);

      await this.messageRepository.hideMessageForUser(messageId, userId);

      await this.bullMqService.addJob(QueueNames.MESSAGE_QUEUE, JobTypes.DELETE_MESSAGE_SELF, {
        queueName: QueueNames.MESSAGE_QUEUE,
        jobType: JobTypes.DELETE_MESSAGE_SELF,
        payload: {
          messageId: messageId,
          userId: userId,
        },
      });

      return { message: 'You deleted message for yourself' };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('Failed to delete message', error);
      throw new InternalServerErrorException('Failed to delete message for self');
    }
  }

  private async findMessageOrThrow(messageId: string, userId: string) {
    const message = await this.messageRepository.findMessageById(messageId, userId);
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

  private async checkIsMessageAlreadyDeletedForUser(messageId: string, userId: string) {
    const isMessageAlreadyHidden = await this.messageRepository.isMessageHiddenForUser(
      messageId,
      userId,
    );
    if (isMessageAlreadyHidden) {
      throw new ConflictException('You are already deleted message for yourself');
    }
  }

  private checkIsUserChatMember(userId: string, members: ChatMember[]) {
    const isUserChatMember = members.find((member) => member.id === userId);
    if (!isUserChatMember) {
      throw new ForbiddenException('You are not member of this chat');
    }
  }
}
