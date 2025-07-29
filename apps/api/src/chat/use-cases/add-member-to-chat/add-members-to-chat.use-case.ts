import { Chat, ChatMember, IChatRepository, IUserRepository, User } from '@ecorally/dal';
import {
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddMembersToChatCommand } from './add-members-to-chat.command';
import { ChatMemberRole, ChatType } from '@ecorally/shared';

@Injectable()
export class AddMembersToChatUseCase {
  private readonly MAX_CHAT_MEMBERS = 100;

  constructor(
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: AddMembersToChatCommand) {
    try {
      const chat = await this.validateChat(command.chatId, command.userId);
      const invitedUsers = await this.validateInvitedUsers(chat, command.invitedUserIds);
      const newMembers = this.createNewMembers(invitedUsers);

      await this.chatRepository.addMembersToChat(newMembers, chat.id);

      return 'Users was added to the group';
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to add new member');
    }
  }

  private async validateChat(chatId: string, userId: string) {
    const chat = await this.chatRepository.findById(chatId, true);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (chat.isDeleted) {
      throw new GoneException(`Chat with ID ${chatId} was deleted`);
    }

    if (chat.type === ChatType.DIRECT) {
      throw new ConflictException('You cannot invite users to direct chat');
    }

    if (!chat.members.some((member) => member.id === userId)) {
      throw new ForbiddenException('You have no access to invite users to this chat');
    }

    return chat;
  }

  private async validateInvitedUsers(chat: Chat, invitedIds: string[]) {
    if (invitedIds.length > this.MAX_CHAT_MEMBERS - chat.members.length) {
      throw new ConflictException('The maximum number of users in a group is 100');
    }

    const memberIds = new Set(chat.members.map((member) => member.id));
    const duplicateIds = invitedIds.filter((id) => memberIds.has(id));
    if (duplicateIds.length > 0) {
      throw new ConflictException(`Users already in group: ${duplicateIds.join(', ')}`);
    }

    const invitedUsers = await this.userRepository.findMany(invitedIds);
    const foundUserIds = invitedUsers.map((u) => u.id);
    const foundUserIdsSet = new Set(foundUserIds);
    const notFoundIds = invitedIds.filter((id) => !foundUserIdsSet.has(id));

    if (notFoundIds.length > 0) {
      throw new NotFoundException(`Users not found: ${notFoundIds.join(', ')}`);
    }

    return invitedUsers;
  }

  private createNewMembers(invitedUsers: User[]) {
    return invitedUsers.map((user) =>
      ChatMember.create({ id: user.id, role: ChatMemberRole.MEMBER }),
    );
  }
}
