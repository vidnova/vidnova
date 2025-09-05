import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ChatMember, IChatRepository, IMessageRepository } from '@vidnova/dal';
import { DeleteMessageForAllCommand } from './delete-message-for-all.command';
import { BullMqService, ChatMemberRole, ChatType, JobTypes, QueueNames } from '@vidnova/shared';

@Injectable()
export class DeleteMessageForAllUseCase {
  private readonly logger = new Logger(DeleteMessageForAllUseCase.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY') private readonly messageRepository: IMessageRepository,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    private readonly bullMqService: BullMqService,
  ) {}

  async execute(command: DeleteMessageForAllCommand) {
    try {
      const message = await this.findMessageOrThrow(command.messageId);
      const chat = await this.findChatOrThrow(message.chatId);

      this.validateUserPermissions(command.userId, message.sender.id, chat.members, chat.type);

      const deletedMessage = message.deleteForAll();
      await this.messageRepository.updateMessage(deletedMessage);

      await this.bullMqService.addJob(QueueNames.MESSAGE_QUEUE, JobTypes.DELETE_MESSAGE, {
        queueName: QueueNames.MESSAGE_QUEUE,
        jobType: JobTypes.DELETE_MESSAGE,
        payload: {
          messageId: deletedMessage.id,
          chatId: deletedMessage.chatId,
        },
      });

      return { message: 'Message has been deleted' };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('Failed to delete message', error);
      throw new InternalServerErrorException('Failed to delete message');
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

  private validateUserPermissions(
    userId: string,
    messageSenderId: string,
    chatMembers: ChatMember[],
    chatType: ChatType,
  ) {
    const userInChat = chatMembers.find((member) => member.id === userId);
    if (!userInChat) {
      throw new ForbiddenException('You do not have access to edit the contents of this chat');
    }

    if (
      chatType !== ChatType.DIRECT &&
      userId !== messageSenderId &&
      userInChat.role === ChatMemberRole.MEMBER
    ) {
      throw new ForbiddenException('You do not have permission to delete this message');
    }
  }
}
