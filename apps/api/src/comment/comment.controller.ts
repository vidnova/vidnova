import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCommentUseCase } from './use-cases/create-comment/create-comment.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateCommentCommand } from './use-cases/create-comment/create-comment.command';

@Controller('comments')
export class CommentController {
  constructor(private readonly createCommentUseCase: CreateCommentUseCase) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Req() req: FastifyRequest, @Body() data: CreateCommentDto) {
    const user = req.user;

    return this.createCommentUseCase.execute(
      CreateCommentCommand.create({
        userId: user?.id,
        ...data,
      }),
    );
  }
}
