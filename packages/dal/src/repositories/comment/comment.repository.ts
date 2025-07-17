import { ICommentRepository } from './comment-repository.interface';
import { PrismaService } from '../shared';
import { Comment } from './comment.entity';
import { Injectable } from '@nestjs/common';
import { CommentUser } from './comment-user.vo';
import { CommentDto } from './comment.dto';

@Injectable()
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
      include: {
        user: {
          select: {
            id: true,
            imageUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const user = CommentUser.fromPersistence(createdComment.user);

    return Comment.fromPersistence({ ...createdComment, user });
  }

  async findById(commentId: string) {
    const comment = await this.prismaService.comment.findUnique({ where: { id: commentId } });

    if (!comment) return null;

    return Comment.fromPersistence(comment);
  }

  async findByEventId(eventId: string): Promise<{ comments: CommentDto[] }> {
    // TODO: implement filters and pagination

    const comments = await this.prismaService.comment.findMany({
      where: { eventId, parentId: null },
      select: {
        id: true,
        eventId: true,
        content: true,
        user: {
          select: {
            id: true,
            imageUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return { comments };
  }

  async findAllByParentId(parentId: string): Promise<{ comments: CommentDto[] }> {
    // TODO: implement pagination

    const comments = await this.prismaService.comment.findMany({
      where: { parentId },
      select: {
        id: true,
        eventId: true,
        content: true,
        user: {
          select: {
            id: true,
            imageUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return { comments };
  }

  async update(comment: Comment): Promise<Comment> {
    const updatedComment = await this.prismaService.comment.update({
      where: { id: comment.id },
      data: {
        content: comment.content,
      },
      include: {
        user: {
          select: {
            id: true,
            imageUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const user = CommentUser.fromPersistence(updatedComment.user);

    return Comment.fromPersistence({ ...updatedComment, user });
  }

  async delete(commentId: string) {
    await this.prismaService.comment.delete({ where: { id: commentId } });
  }
}
