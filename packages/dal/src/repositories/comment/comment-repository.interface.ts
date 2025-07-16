import { Comment } from './comment.entity';

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;

  findById(commentId: string): Promise<Comment | null>;
}
