import { Chat, ChatMember, IChatRepository, IUserRepository } from '@ecorally/dal';
import {
  HttpException,
  Inject,
  Injectable,
  IntrinsicException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupChatCommand } from './create-group-chat.command';
import { ChatMemberRole, ChatType } from '@ecorally/shared';

@Injectable()
export class CreateGroupChatUseCase {
  constructor(
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateGroupChatCommand) {
    try {
      const uniqueMembers = new Set(command.memberIds);

      const members = await this.userRepository.findMany(Array.from(uniqueMembers));

      if (members.length !== command.memberIds.length) {
        throw new NotFoundException('Some users not found');
      }

      const createdMembers = [
        ChatMember.create({ id: command.userId, role: ChatMemberRole.OWNER }),
        ...command.memberIds.map((memberId) =>
          ChatMember.create({ id: memberId, role: ChatMemberRole.MEMBER }),
        ),
      ];

      const chat = Chat.create({
        name: command.name,
        description: command.description,
        imageUrl: command.imageUrl,
        type: ChatType.GROUP,
        members: createdMembers,
      });

      return this.chatRepository.create(chat);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new IntrinsicException('Failed to create group chat');
    }
  }
}
