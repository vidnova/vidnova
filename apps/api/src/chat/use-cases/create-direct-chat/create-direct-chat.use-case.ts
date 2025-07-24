import { Chat, ChatMember, IChatRepository, IUserRepository } from '@ecorally/dal';
import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDirectChatCommand } from './create-direct-chat.command';
import { ChatMemberRole, ChatType } from '@ecorally/shared';

@Injectable()
export class CreateDirectChatUseCase {
  constructor(
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateDirectChatCommand) {
    try {
      const recipient = await this.userRepository.findFullById(command.recipientId);

      if (!recipient) {
        throw new NotFoundException(`Recipient user with ID ${command.recipientId} not found`);
      }

      const existingChat = await this.chatRepository.findDirectChat(
        command.initiatorId,
        command.recipientId,
      );

      if (existingChat) {
        throw new ConflictException(`You already have a chat with this user`);
      }

      const members = [
        ChatMember.create({
          id: command.initiatorId,
          role: ChatMemberRole.MEMBER,
        }),
        ChatMember.create({ id: command.recipientId, role: ChatMemberRole.MEMBER }),
      ];

      const chat = Chat.create({
        ...command,
        type: ChatType.DIRECT,
        name: null,
        description: null,
        imageUrl: '',
        members,
      });

      return this.chatRepository.create(chat);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to create chat');
    }
  }
}
