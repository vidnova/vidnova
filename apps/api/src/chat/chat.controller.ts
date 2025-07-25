import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateGroupChatUseCase } from './use-cases/create-group-chat/create-group-chat.use-case';
import { CreateGroupChatCommand } from './use-cases/create-group-chat/create-group-chat.command';
import { CreateGroupChatDto } from './dtos/create-group-chat.dto';
import { GetChatUseCase } from './use-cases/get-chat/get-chat.use-case';
import { GetChatCommand } from './use-cases/get-chat/get-chat.command';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly createGroupChatUseCase: CreateGroupChatUseCase,
    private readonly getChatUseCase: GetChatUseCase,
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
}
