import { CommentUser } from './comment-user.vo';
import { v4 } from 'uuid';

export class Comment {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _eventId: string,
    private readonly _content: string,
    private readonly _parentId: string | null,
    private readonly _replies: Comment[],
    private readonly _user?: CommentUser,
  ) {}

  static create(params: {
    userId: string;
    eventId: string;
    content: string;
    parentId: string;
  }): Comment {
    if (params.content.trim().length === 0) {
      throw new Error('Content length must be at least 1 character');
    }
    return new Comment(v4(), params.userId, params.eventId, params.content, params.parentId, []);
  }

  static fromPersistence(params: {
    id: string;
    userId: string;
    eventId: string;
    content: string;
    parentId: string | null;
    replies: Comment[];
    user?: CommentUser;
  }): Comment {
    return new Comment(
      params.id,
      params.userId,
      params.eventId,
      params.content,
      params.parentId,
      params.replies,
      params.user,
    );
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get eventId(): string {
    return this._eventId;
  }

  get content(): string {
    return this._content;
  }

  get parentId(): string | null {
    return this._parentId;
  }

  get user(): CommentUser | undefined {
    return this._user;
  }

  get replies(): Comment[] {
    return this._replies;
  }
}
