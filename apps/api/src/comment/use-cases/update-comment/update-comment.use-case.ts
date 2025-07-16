import { ICommentRepository } from '@ecorally/dal';
import { UpdateCommentCommand } from './update-comment.command';
import {
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class UpdateCommentUseCase {
  constructor(
    @Inject('COMMENT_REPOSITORY') private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: UpdateCommentCommand) {
    try {
      const comment = await this.commentRepository.findById(command.commentId);

      if (!comment) {
        throw new NotFoundException(`Comment with ID ${command.commentId} not found`);
      }

      if (command.userId !== comment.userId) {
        throw new ForbiddenException('You have no access to change this content');
      }

      const updatedComment = comment.updateContent(command.content);

      return this.commentRepository.update(updatedComment);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to update comment');
    }
  }
}
