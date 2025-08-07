import { ICommentRepository } from '@vidnova/dal';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { GetCommentsByEventIdCommand } from './get-comments-by-event-id.command';

export class GetCommentsByEventIdUseCase {
  constructor(
    @Inject('COMMENT_REPOSITORY') private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: GetCommentsByEventIdCommand) {
    try {
      // TODO: implement comment filters and pagination

      return this.commentRepository.findByEventId(command.eventId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to get comments');
    }
  }
}
