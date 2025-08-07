import { ChatType } from '@vidnova/shared';
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
    private readonly _isDeleted?: boolean,
    private readonly _deletedAt?: Date | null,
    private readonly _members?: ChatMember[],
  ) {}

  static create(params: {
    type: ChatType;
    imageUrl: string;
    name: string | null;
    description: string | null;
    members: ChatMember[];
  }): Chat {
    if (params.members.length < 2) {
      throw Error('Minimum members length is 2');
    }

    if (params.members.length > 50) {
      throw Error('Maximum members length is 50');
    }

    return new Chat(
      v4(),
      params.type,
      params.imageUrl,
      new Date(),
      new Date(),
      params.name,
      params.description,
      false,
      null,
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
    description?: string | null;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    members?: ChatMember[];
  }): Chat {
    return new Chat(
      params.id,
      params.type,
      params.imageUrl,
      params.createdAt,
      params.updatedAt,
      params.name,
      params.description ?? null,
      params.isDeleted,
      params.deletedAt,
      params.members ?? [],
    );
  }

  update(params: { imageUrl?: string; name?: string; description?: string | null }): Chat {
    return new Chat(
      this.id,
      this._type,
      params.imageUrl || this._imageUrl,
      this._createdAt,
      new Date(),
      params.name ?? this._name,
      params.description ?? this._description,
      this._isDeleted,
      this._deletedAt,
      this._members,
    );
  }

  delete(): Chat {
    return new Chat(
      this.id,
      this._type,
      this._imageUrl,
      this._createdAt,
      this._updateAt,
      this._name,
      this._description,
      true,
      new Date(),
      this._members,
    );
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      type: this._type,
      imageUrl: this._imageUrl,
      ...(this._members?.length ? { members: this._members } : {}),
      createdAt: this._createdAt,
      updatedAt: this._updateAt,
    };
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

  get isDeleted(): boolean | undefined {
    return this._isDeleted;
  }

  get deletedAt(): Date | null | undefined {
    return this._deletedAt;
  }

  get members(): ChatMember[] | undefined {
    return this._members;
  }
}
