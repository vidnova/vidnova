import { IMessageRepository } from './message-repository.interface';
import { PrismaService } from '../shared';
import { Message } from './message.entity';
import { MessageMapper } from './message.mapper';
import { MessageQuery } from './message.query';
import { Injectable } from '@nestjs/common';
import { GetAllMessagesFilters } from '@vidnova/shared';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMessage(message: Message): Promise<Message> {
    const persistedMessageData = await this.prismaService.$transaction(async (prisma) => {
      return prisma.message.create({
        data: {
          id: message.id,
          content: message.content,
          senderId: message.sender.id,
          chatId: message.chatId,
          type: message.type,
          attachments: {
            createMany: {
              data: message.attachments.map((attachment) => ({
                id: attachment.id,
                fileName: attachment.fileName,
                fileSize: attachment.fileSize,
                mimeType: attachment.mimeType,
                url: attachment.url,
                type: attachment.type,
                messageId: attachment.messageId,
              })),
            },
          },
          replyToId: message.replyTo?.id,
        },
        select: MessageQuery.SELECT_FIELDS,
      });
    });

    return MessageMapper.toDomain(persistedMessageData);
  }

  async getAllByChatId(
    chatId: string,
    filters: GetAllMessagesFilters,
  ): Promise<{ messages: Message[]; hasMore: boolean }> {
    const { page = 1, limit = 100 } = filters;

    const skip = (page - 1) * limit;
    const take = limit + 1;

    const messages = await this.prismaService.message.findMany({
      where: { chatId },
      skip,
      take,
      select: MessageQuery.SELECT_FIELDS,
    });

    const hasMore = messages.length > limit;

    return {
      messages: messages.slice(0, limit).map((message) => MessageMapper.toDomain(message)),
      hasMore,
    };
  }
}
