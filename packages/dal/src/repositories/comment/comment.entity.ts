import { CommentUser } from './comment-user.vo';

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
