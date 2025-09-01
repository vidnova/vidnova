import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateMessageUseCase } from './use-cases/create-message/create-message.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateMessageDto } from './dtos/create-message.dto';
import { CreateMessageCommand } from './use-cases/create-message/create-message.command';
import { CreateMessageReactionDto } from './dtos/create-message-reaction.dto';
import { CreateMessageReactionUseCase } from './use-cases/create-message-reaction/create-message-reaction.use-case';
import { CreateMessageReactionCommand } from './use-cases/create-message-reaction/create-message-reaction.command';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly createMessageReactionUseCase: CreateMessageReactionUseCase,
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
}
