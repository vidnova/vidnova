import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateChatMemberRoleDto } from './dtos/update-chat-member-role.dto';
import { UpdateChatMemberRoleUseCase } from './use-cases/update-chat-member-role/update-chat-member-role.use-case';
import { UpdateChatMemberRoleCommand } from './use-cases/update-chat-member-role/update-chat-member-role.command';
import { UpdateChatInfoDto } from './dtos/update-chat-info.dto';
import { UpdateChatInfoUseCase } from './use-cases/update-chat-info/update-chat-info.use-case';
import { UpdateChatInfoCommand } from './use-cases/update-chat-info/update-chat-info.command';
import { GetUserChatsUseCase } from './use-cases/get-user-chats/get-user-chats.use-case';
import { GetUserChatsCommand } from './use-cases/get-user-chats/get-user-chats.command';
import { CreateDirectChatUseCase } from './use-cases/create-direct-chat/create-direct-chat.use-case';
import { CreateDirectChatDto } from './dtos/create-direct-chat.dto';
import { CreateDirectChatCommand } from './use-cases/create-direct-chat/create-direct-chat.command';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly createGroupChatUseCase: CreateGroupChatUseCase,
    private readonly getChatUseCase: GetChatUseCase,
    private readonly addMemberToChatUseCase: AddMembersToChatUseCase,
    private readonly deleteChatMemberUseCase: DeleteChatMemberUseCase,
    private readonly updateChatMemberRoleUseCase: UpdateChatMemberRoleUseCase,
    private readonly updateChatInfoUseCase: UpdateChatInfoUseCase,
    private readonly getUserChatsUseCase: GetUserChatsUseCase,
    private readonly createDirectChatUseCase: CreateDirectChatUseCase,
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

  @Patch(':chatId/members/:memberUserId/role')
  @UseGuards(AuthGuard)
  async updateChatMemberRole(
    @Param('chatId') chatId: string,
    @Param('memberUserId') memberUserId: string,
    @Req() req: FastifyRequest,
    @Body() data: UpdateChatMemberRoleDto,
  ) {
    const user = req.user;

    return this.updateChatMemberRoleUseCase.execute(
      UpdateChatMemberRoleCommand.create({
        userId: user.id,
        memberUserId,
        chatId,
        newRole: data.newRole,
      }),
    );
  }

  @Put(':chatId')
  @UseGuards(AuthGuard)
  async updateChat(
    @Req() req: FastifyRequest,
    @Param('chatId') chatId: string,
    @Body() data: UpdateChatInfoDto,
  ) {
    const user = req.user;

    return this.updateChatInfoUseCase.execute(
      UpdateChatInfoCommand.create({
        userId: user.id,
        ...data,
        chatId,
      }),
    );
  }

  @Get('my')
  @UseGuards(AuthGuard)
  getUserChats(@Req() req: FastifyRequest) {
    const user = req.user;

    return this.getUserChatsUseCase.execute(GetUserChatsCommand.create({ userId: user.id }));
  }

  @Post('direct')
  @UseGuards(AuthGuard)
  async createDirectChat(@Req() req: FastifyRequest, @Body() data: CreateDirectChatDto) {
    const user = req.user;

    return this.createDirectChatUseCase.execute(
      CreateDirectChatCommand.create({
        initiatorId: user.id,
        recipientId: data.recipientId,
      }),
    );
  }
}
