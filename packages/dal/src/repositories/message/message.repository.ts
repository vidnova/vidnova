import { IMessageRepository } from './message-repository.interface';
import { PrismaService } from '../shared';
import { Message } from './message.entity';
import { MessageMapper } from './message.mapper';
import { MessageQuery } from './message.query';
import { Injectable } from '@nestjs/common';

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
}
