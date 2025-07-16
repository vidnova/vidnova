import { Comment } from './comment.entity';
import { CommentDto } from './comment.dto';

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;

  findById(commentId: string): Promise<Comment | null>;

  findByEventId(eventId: string): Promise<{ comments: CommentDto[] }>;

  findAllByParentId(parentId: string): Promise<{ comments: CommentDto[] }>;

  update(comment: Comment): Promise<Comment>;

  delete(commentId: string): Promise<void>;
}
