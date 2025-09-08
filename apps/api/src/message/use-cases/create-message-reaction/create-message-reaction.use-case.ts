import { IChatRepository, IMessageRepository, MessageReaction } from '@vidnova/dal';
import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageReactionCommand } from './create-message-reaction.command';
import { BullMqService, JobTypes, QueueNames } from '@vidnova/shared';

@Injectable()
export class CreateMessageReactionUseCase {
  private logger = new Logger(CreateMessageReactionUseCase.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY') private readonly messageRepository: IMessageRepository,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    private readonly bullMqService: BullMqService,
  ) {}

  async execute(command: CreateMessageReactionCommand) {
    try {
      const { userId, messageId, emoji } = command;

      const message = await this.getMessageOrFail(messageId, userId);
      const chat = await this.getChatOrFail(message.chatId);
      this.ensureUserInChat(chat.members, userId);

      const createdReaction = await this.createReaction(userId, messageId, emoji);
      await this.enqueueReaction(createdReaction);

      return createdReaction;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('Failed to create reaction: ', error);
      throw new InternalServerErrorException('Failed to create reaction');
    }
  }

  private async getMessageOrFail(messageId: string, userId: string) {
    const message = await this.messageRepository.findMessageById(messageId, userId);
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    return message;
  }

  private async getChatOrFail(chatId: string) {
    const chat = await this.chatRepository.findById(chatId, true);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    return chat;
  }

  private ensureUserInChat(members: { id: string }[], userId: string) {
    const isUserExist = members.some((member) => member.id === userId);
    if (!isUserExist) {
      throw new ForbiddenException(`User ${userId} is not a member of this chat`);
    }
  }

  private async createReaction(userId: string, messageId: string, emoji: string) {
    const messageReaction = MessageReaction.create({
      emoji,
      userId,
      messageId,
    });

    return this.messageRepository.upsertReaction(messageReaction);
  }

  private async enqueueReaction(reaction: MessageReaction) {
    await this.bullMqService.addJob(QueueNames.MESSAGE_QUEUE, JobTypes.SEND_MESSAGE_REACTION, {
      queueName: QueueNames.MESSAGE_QUEUE,
      jobType: JobTypes.SEND_MESSAGE_REACTION,
      payload: reaction,
    });
  }
}
