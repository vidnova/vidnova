import { ChatMember, IChatRepository } from '@vidnova/dal';
import {
  ForbiddenException,
  GoneException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteChatMemberCommand } from './delete-chat-member.command';
import { ChatMemberRole } from '@vidnova/shared';

@Injectable()
export class DeleteChatMemberUseCase {
  constructor(@Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository) {}

  async execute(command: DeleteChatMemberCommand) {
    try {
      await this.validateChat(command.chatId);

      const [actingMember, targetMember] = await Promise.all([
        this.getMemberOrThrow(command.userId, command.chatId, 'You are not a member of this chat'),
        this.getMemberOrThrow(command.memberUserId, command.chatId, 'Such member not found'),
      ]);

      this.checkPermissions(actingMember, targetMember);

      await this.chatRepository.deleteChatMemberByUserAndChatIds(
        command.memberUserId,
        command.chatId,
      );

      return { message: 'Chat member was deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to delete member');
    }
  }

  private async validateChat(chatId: string) {
    const chat = await this.chatRepository.findById(chatId, false);

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (chat.isDeleted) {
      throw new GoneException(`Chat with ID ${chatId} was deleted`);
    }
  }

  private async getMemberOrThrow(userId: string, chatId: string, errorMessage: string) {
    const member = await this.chatRepository.findMemberByUserAndChatIds(userId, chatId);

    if (!member) throw new NotFoundException(errorMessage);

    return member;
  }

  private checkPermissions(
    acting: Pick<ChatMember, 'id' | 'role'>,
    target: Pick<ChatMember, 'id'>,
  ) {
    const isSelfRemoval = acting.id === target.id;
    const isOwner = acting.role === ChatMemberRole.OWNER;

    if (!isSelfRemoval && !isOwner) {
      throw new ForbiddenException('You do not have access to manage members');
    }
  }
}
