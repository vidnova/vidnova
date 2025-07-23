import { ChatType } from '@ecorally/shared';
import { ChatMember } from './chat-member.vo';

export class Chat {
  constructor(
    private readonly _id: string,
    private readonly _chatType: ChatType,
    private readonly _imageUrl: string,
    private readonly _createdAt: Date,
    private readonly _updateAt: Date,
    private readonly _name: string | null,
    private readonly _description: string | null,
    private readonly _members: ChatMember[],
  ) {}

  get id(): string {
    return this._id;
  }

  get chatType(): ChatType {
    return this._chatType;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updateAt;
  }

  get name(): string | null {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get members(): ChatMember[] {
    return this._members;
  }
}
