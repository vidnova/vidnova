import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateMessageUseCase } from './use-cases/create-message/create-message.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateMessageDto } from './dtos/create-message.dto';
import { CreateMessageCommand } from './use-cases/create-message/create-message.command';

@Controller('messages')
export class MessageController {
  constructor(private readonly createMessageUseCase: CreateMessageUseCase) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req: FastifyRequest, @Body() data: CreateMessageDto) {
    const user = req.user;

    return this.createMessageUseCase.execute(
      CreateMessageCommand.create({
        userId: user.id,
        ...data,
      }),
    );
  }
}
