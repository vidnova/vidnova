import { ICommentRepository } from '@ecorally/dal';
import { DeleteCommentCommand } from './delete-comment.command';
import {
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class DeleteCommentUseCase {
  constructor(
    @Inject('COMMENT_REPOSITORY') private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: DeleteCommentCommand) {
    try {
      const comment = await this.commentRepository.findById(command.commentId);

      if (!comment) {
        throw new NotFoundException(`Comment with ID ${command.commentId} not found`);
      }

      if (command.userId !== comment.userId) {
        throw new ForbiddenException('You have no access to change this content');
      }

      return this.commentRepository.delete(command.commentId);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to update comment');
    }
  }
}
