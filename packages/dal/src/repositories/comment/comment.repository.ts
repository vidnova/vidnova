import { ICommentRepository } from './comment-repository.interface';
import { PrismaService } from '../shared';
import { Comment } from './comment.entity';

export class CommentRepository implements ICommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(comment: Comment): Promise<Comment> {
    const createdComment = await this.prismaService.comment.create({
      data: {
        id: comment.id,
        userId: comment.userId,
        eventId: comment.eventId,
        content: comment.content,
        parentId: comment.parentId,
      },
    });

    return Comment.fromPersistence({ ...createdComment, replies: [] });
  }
}
