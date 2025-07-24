import { ChatType } from '@ecorally/shared';
import { ChatMember } from './chat-member.vo';
import { v4 } from 'uuid';

export class Chat {
  constructor(
    private readonly _id: string,
    private readonly _type: ChatType,
    private readonly _imageUrl: string,
    private readonly _createdAt: Date,
    private readonly _updateAt: Date,
    private readonly _name: string | null,
    private readonly _description: string | null,
    private readonly _members: ChatMember[],
  ) {}

  static create(params: {
    type: ChatType;
    imageUrl: string;
    name: string | null;
    description: string | null;
    members: ChatMember[];
  }): Chat {
    return new Chat(
      v4(),
      params.type,
      params.imageUrl,
      new Date(),
      new Date(),
      params.name,
      params.description,
      params.members,
    );
  }

  static fromPersistence(params: {
    id: string;
    type: ChatType;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    name: string | null;
    description: string | null;
    members?: ChatMember[];
  }): Chat {
    return new Chat(
      params.id,
      params.type,
      params.imageUrl,
      params.createdAt,
      params.updatedAt,
      params.name,
      params.description,
      params.members ?? [],
    );
  }

  get id(): string {
    return this._id;
  }

  get type(): ChatType {
    return this._type;
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
