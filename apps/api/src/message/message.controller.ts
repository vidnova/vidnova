import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateMessageUseCase } from './use-cases/create-message/create-message.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateMessageDto } from './dtos/create-message.dto';
import { CreateMessageCommand } from './use-cases/create-message/create-message.command';
import { CreateMessageReactionDto } from './dtos/create-message-reaction.dto';
import { CreateMessageReactionUseCase } from './use-cases/create-message-reaction/create-message-reaction.use-case';
import { CreateMessageReactionCommand } from './use-cases/create-message-reaction/create-message-reaction.command';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { UpdateMessageUseCase } from './use-cases/update-message/update-message.use-case';
import { UpdateMessageCommand } from './use-cases/update-message/update-message.command';
import { DeleteMessageForAllUseCase } from './use-cases/delete-message-for-all/delete-message-for-all.use-case';
import { DeleteMessageForAllCommand } from './use-cases/delete-message-for-all/delete-message-for-all.command';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly createMessageReactionUseCase: CreateMessageReactionUseCase,
    private readonly updateMessageUseCase: UpdateMessageUseCase,
    private readonly deleteMessageForAllUseCase: DeleteMessageForAllUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createMessage(@Req() req: FastifyRequest, @Body() data: CreateMessageDto) {
    const user = req.user;

    return this.createMessageUseCase.execute(
      CreateMessageCommand.create({
        userId: user.id,
        ...data,
      }),
    );
  }

  @Post(':messageId/reaction')
  @UseGuards(AuthGuard)
  async createMessageReaction(
    @Req() req: FastifyRequest,
    @Body() data: CreateMessageReactionDto,
    @Param('messageId') messageId: string,
  ) {
    const user = req.user;

    return this.createMessageReactionUseCase.execute(
      CreateMessageReactionCommand.create({
        userId: user.id,
        messageId,
        emoji: data.emoji,
      }),
    );
  }

  @Put(':messageId')
  @UseGuards(AuthGuard)
  async updateMessage(
    @Req() req: FastifyRequest,
    @Param('messageId') messageId: string,
    @Body() data: UpdateMessageDto,
  ) {
    const user = req.user;

    return this.updateMessageUseCase.execute(
      UpdateMessageCommand.create({
        userId: user.id,
        messageId,
        content: data.content,
      }),
    );
  }

  @Delete(':messageId')
  @UseGuards(AuthGuard)
  async deleteMessage(@Req() req: FastifyRequest, @Param('messageId') messageId: string) {
    const { id: userId } = req.user;

    return this.deleteMessageForAllUseCase.execute(
      DeleteMessageForAllCommand.create({
        userId,
        messageId,
      }),
    );
  }
}
