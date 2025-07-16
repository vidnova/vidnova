import { Comment } from './comment.entity';

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
}
