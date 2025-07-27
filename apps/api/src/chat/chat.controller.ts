import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateGroupChatUseCase } from './use-cases/create-group-chat/create-group-chat.use-case';
import { CreateGroupChatCommand } from './use-cases/create-group-chat/create-group-chat.command';
import { CreateGroupChatDto } from './dtos/create-group-chat.dto';
import { GetChatUseCase } from './use-cases/get-chat/get-chat.use-case';
import { GetChatCommand } from './use-cases/get-chat/get-chat.command';
import { AddMembersToChatDto } from './dtos/add-members-to-chat.dto';
import { AddMembersToChatUseCase } from './use-cases/add-member-to-chat/add-members-to-chat.use-case';
import { AddMembersToChatCommand } from './use-cases/add-member-to-chat/add-members-to-chat.command';
import { DeleteChatMemberUseCase } from './use-cases/delete-chat-member/delete-chat-member.use-case';
import { DeleteChatMemberCommand } from './use-cases/delete-chat-member/delete-chat-member.command';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly createGroupChatUseCase: CreateGroupChatUseCase,
    private readonly getChatUseCase: GetChatUseCase,
    private readonly addMemberToChatUseCase: AddMembersToChatUseCase,
    private readonly deleteChatMemberUseCase: DeleteChatMemberUseCase,
  ) {}

  @Post('group')
  @UseGuards(AuthGuard)
  createGroup(@Req() req: FastifyRequest, @Body() data: CreateGroupChatDto) {
    const user = req.user;

    return this.createGroupChatUseCase.execute(
      CreateGroupChatCommand.create({
        userId: user.id,
        memberIds: data.memberIds,
      }),
    );
  }

  @Get(':chatId')
  @UseGuards(AuthGuard)
  getById(@Param('chatId') chatId: string, @Req() req: FastifyRequest) {
    const user = req.user;

    return this.getChatUseCase.execute(
      GetChatCommand.create({
        userId: user.id,
        chatId,
      }),
    );
  }

  @Post(':chatId/members')
  @UseGuards(AuthGuard)
  async addMemberToChat(
    @Param('chatId') chatId: string,
    @Req() req: FastifyRequest,
    @Body() data: AddMembersToChatDto,
  ) {
    const user = req.user;

    const result = await this.addMemberToChatUseCase.execute(
      AddMembersToChatCommand.create({
        userId: user.id,
        ...data,
        chatId,
      }),
    );

    return { message: result };
  }

  @Delete(':chatId/members/:memberUserId')
  @UseGuards(AuthGuard)
  async deleteMember(
    @Req() req: FastifyRequest,
    @Param('chatId') chatId: string,
    @Param('memberUserId') memberUserId: string,
  ) {
    const user = req.user;

    return this.deleteChatMemberUseCase.execute(
      DeleteChatMemberCommand.create({
        userId: user.id,
        memberUserId,
        chatId,
      }),
    );
  }
}
