import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateGroupChatUseCase } from './use-cases/create-group-chat/create-group-chat.use-case';
import { CreateGroupChatCommand } from './use-cases/create-group-chat/create-group-chat.command';
import { CreateGroupChatDto } from './dtos/create-group-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly createGroupChatUseCase: CreateGroupChatUseCase) {}

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
}
