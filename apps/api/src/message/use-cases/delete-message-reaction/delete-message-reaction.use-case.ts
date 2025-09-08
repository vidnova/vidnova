import { ChatMember, IChatRepository, IMessageRepository } from '@vidnova/dal';
import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteMessageReactionCommand } from './delete-message-reaction.command';

@Injectable()
export class DeleteMessageReactionUseCase {
  private readonly logger = new Logger(DeleteMessageReactionUseCase.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY') private readonly messageRepository: IMessageRepository,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
  ) {}

  async execute(command: DeleteMessageReactionCommand) {
    try {
      const { userId, messageId } = command;

      const message = await this.findMessageOrThrow(messageId, userId);
      const [chat, messageReaction] = await Promise.all([
        this.findChatOrThrow(message.chatId),
        this.findMessageReactionOrThrow(messageId, userId),
      ]);

      this.validateUserPermissions(userId, messageReaction.userId, chat.members);

      await this.messageRepository.deleteReaction(messageId, userId);

      return { message: 'Message reaction was successfully deleted' };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('Failed to delete a reaction to a message', error);
      throw new InternalServerErrorException('Failed to delete a reaction to a message');
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

  private async findMessageReactionOrThrow(messageId: string, userId: string) {
    const messageReaction = await this.messageRepository.findMessageReaction(messageId, userId);
    if (!messageReaction) {
      throw new NotFoundException('Message reaction was not found');
    }
    return messageReaction;
  }

  private validateUserPermissions(
    userId: string,
    reactionCreatorId: string,
    chatMembers: ChatMember[],
  ) {
    const userInChat = chatMembers.find((member) => member.id === userId);
    if (!userInChat) {
      throw new ForbiddenException('You do not have access to edit the contents of this chat');
    }

    if (reactionCreatorId !== userId) {
      throw new ForbiddenException('You do not have access to edit this content');
    }
  }
}
