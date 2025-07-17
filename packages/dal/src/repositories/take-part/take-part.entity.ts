import { v4 } from 'uuid';

export class TakePart {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _eventId: string,
  ) {}

  static create(params: { userId: string; eventId: string }): TakePart {
    return new TakePart(v4(), params.userId, params.eventId);
  }

  static fromPersistence(params: { id: string; userId: string; eventId: string }): TakePart {
    return new TakePart(params.id, params.userId, params.eventId);
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

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      eventId: this._eventId,
    };
  }
}
