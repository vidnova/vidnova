import { Comment, ICommentRepository } from '@vidnova/dal';
import { CreateCommentCommand } from './create-comment.command';
import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject('COMMENT_REPOSITORY') private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    try {
      if (command.parentId) {
        const parentComment = await this.commentRepository.findById(command.parentId);

        if (parentComment.eventId !== command.eventId) {
          throw new ConflictException(
            'The passed event ID does not match the parent comment event ID',
          );
        }
      }

      const comment = Comment.create({ ...command });

      return this.commentRepository.create(comment);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to create comment');
    }
  }
}
