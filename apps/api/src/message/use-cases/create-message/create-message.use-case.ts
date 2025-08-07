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
import { CreateMessageCommand } from './create-message.command';
import {
  Chat,
  IChatRepository,
  IMessageRepository,
  Message,
  MessageAttachment,
  MessageReply,
  MessageSender,
  RedisService,
} from '@vidnova/dal';
import { BullMqService, JobTypes, QueueNames } from '@vidnova/shared';

@Injectable()
export class CreateMessageUseCase {
  private readonly CACHE_TTL = 300;
  private logger = new Logger(CreateMessageUseCase.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY') private readonly messageRepository: IMessageRepository,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    private readonly bullMqService: BullMqService,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: CreateMessageCommand) {
    try {
      await this.validateChat(command.chatId, command.userId);
      const message = this.messageMapper(command);

      const createdMessage = await this.messageRepository.createMessage(message);

      await this.bullMqService.addJob(QueueNames.MESSAGE_QUEUE, JobTypes.SEND_MESSAGE, {
        queueName: QueueNames.MESSAGE_QUEUE,
        jobType: JobTypes.SEND_MESSAGE,
        payload: createdMessage,
      });

      return createdMessage;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to create message: `, error);
      throw new InternalServerErrorException('Failed to create message');
    }
  }

  private async validateChat(chatId: string, userId: string) {
    const cacheKey = `chat:${chatId}:with-members`;
    let chat: Chat;

    const cachedChat = await this.redisService.get(cacheKey);
    if (cachedChat) {
      chat = JSON.parse(cachedChat) as Chat;
    } else {
      chat = await this.chatRepository.findById(chatId, true);

      if (!chat) {
        throw new NotFoundException(`Chat with ID ${chatId} not found`);
      }

      if (chat.isDeleted) {
        throw new GoneException(`Chat with ID ${chatId} was deleted`);
      }

      await this.redisService.set(cacheKey, JSON.stringify(chat), this.CACHE_TTL);
    }

    const chatMemberIds = new Set(chat.members?.map((member) => member.id));
    if (!chatMemberIds.has(userId)) {
      throw new ForbiddenException('You have no access to send messages in this chat');
    }
  }

  private messageMapper(command: CreateMessageCommand) {
    const sender = MessageSender.create({ id: command.userId });
    const attachments = command.attachments
      ? command.attachments.map((attachment) => MessageAttachment.create(attachment))
      : [];
    const replyTo: MessageReply | null = command.replyToMessageId
      ? MessageReply.create({ id: command.replyToMessageId })
      : null;

    return Message.create({
      ...command,
      sender,
      attachments,
      replyTo,
      content: command.content ?? null,
    });
  }
}
