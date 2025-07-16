import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateCommentUseCase } from './use-cases/create-comment/create-comment.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateCommentCommand } from './use-cases/create-comment/create-comment.command';
import { GetCommentRepliesUseCase } from './use-cases/get-comment-replies/get-comment-replies.use-case';
import { GetCommentRepliesCommand } from './use-cases/get-comment-replies/get-comment-replies.command';
import { UpdateCommentUseCase } from './use-cases/update-comment/update-comment.use-case';
import { UpdateCommentCommand } from './use-cases/update-comment/update-comment.command';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { DeleteCommentUseCase } from './use-cases/delete-comment/delete-comment.use-case';
import { DeleteCommentCommand } from './use-cases/delete-comment/delete-comment.command';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getCommentRepliesUseCase: GetCommentRepliesUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

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

  @Get(':commentId/replies')
  async getCommentReplies(@Param('commentId') parentId: string) {
    return this.getCommentRepliesUseCase.execute(GetCommentRepliesCommand.create({ parentId }));
  }

  @Put(':commentId/update')
  @UseGuards(AuthGuard)
  async update(
    @Param('commentId') commentId: string,
    @Req() req: FastifyRequest,
    @Body() data: UpdateCommentDto,
  ) {
    const user = req.user;

    return this.updateCommentUseCase.execute(
      UpdateCommentCommand.create({ userId: user.id, commentId, content: data.content }),
    );
  }

  @Delete(':commentId/delete')
  @UseGuards(AuthGuard)
  async delete(@Req() req: FastifyRequest, @Param('commentId') commentId: string) {
    const user = req.user;

    return this.deleteCommentUseCase.execute(
      DeleteCommentCommand.create({ userId: user.id, commentId }),
    );
  }
}
