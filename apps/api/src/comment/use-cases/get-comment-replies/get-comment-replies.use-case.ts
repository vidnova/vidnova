import { ICommentRepository } from '@ecorally/dal';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { GetCommentRepliesCommand } from './get-comment-replies.command';

export class GetCommentRepliesUseCase {
  constructor(
    @Inject('COMMENT_REPOSITORY') private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: GetCommentRepliesCommand) {
    try {
      // TODO: implement pagination

      return this.commentRepository.findAllByParentId(command.parentId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to get comment replies');
    }
  }
}
