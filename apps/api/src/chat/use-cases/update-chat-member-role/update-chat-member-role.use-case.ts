import { ChatMember, IChatRepository, RedisService } from '@ecorally/dal';
import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateChatMemberRoleCommand } from './update-chat-member-role.command';
import { ChatMemberRole, ChatType } from '@ecorally/shared';

@Injectable()
export class UpdateChatMemberRoleUseCase {
  constructor(
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: UpdateChatMemberRoleCommand) {
    try {
      const cacheKey = `chat:${command.chatId}:with-members`;

      await this.validateChat(command.chatId);

      const [actingMember, targetMember] = await Promise.all([
        this.getMemberOrThrow(command.userId, command.chatId, 'You are not a member of this group'),
        this.getMemberOrThrow(
          command.memberUserId,
          command.chatId,
          `Member with ID ${command.memberUserId} not found in the chat with id ${command.chatId}`,
        ),
      ]);

      await this.validateRole(command.newRole, actingMember, targetMember, command.chatId);

      await this.redisService.delete(cacheKey);

      return this.chatRepository.updateChatMemberRole(
        command.memberUserId,
        command.chatId,
        command.newRole,
      );
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to update member role');
    }
  }

  private async validateChat(chatId: string) {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (chat.type === ChatType.DIRECT) {
      throw new ForbiddenException('You cannot menage roles in the direct chat');
    }
  }

  private async getMemberOrThrow(userId: string, chatId: string, errorMessage: string) {
    const member = await this.chatRepository.findMemberByUserAndChatIds(userId, chatId);

    if (!member) throw new NotFoundException(errorMessage);

    return member;
  }

  private async validateRole(
    newRole: ChatMemberRole,
    acting: Pick<ChatMember, 'role' | 'id'>,
    target: Pick<ChatMember, 'role' | 'id'>,
    chatId: string,
  ) {
    if (newRole === target.role) {
      throw new ConflictException('You have specified the same role as this user currently has');
    }

    if (acting.role !== ChatMemberRole.OWNER) {
      throw new ForbiddenException('You do not have permission to specify this role');
    }

    if (target.id === acting.id) {
      const ownersCount = await this.chatRepository.getChatOwnersCount(chatId);

      if (ownersCount === 1) {
        throw new ConflictException(
          'You cannot change your role until you transfer the owner role to someone else',
        );
      }
    }
  }
}
