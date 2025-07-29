import { ChatMemberRole } from '@ecorally/shared';

export class ChatMember {
  constructor(
    private readonly _id: string,
    private readonly _imageUrl: string,
    private readonly _firstName: string,
    private readonly _lastName: string | null,
    private readonly _role: ChatMemberRole,
    private readonly _isDeleted?: boolean,
    private readonly _deletedAt?: Date | null,
  ) {}

  static create(params: { id: string; role: ChatMemberRole }): ChatMember {
    return new ChatMember(params.id, '', '', null, params.role, false, null);
  }

  static fromPersistence(params: {
    id: string;
    imageUrl: string;
    firstName: string;
    lastName: string | null;
    role: ChatMemberRole;
    isDeleted?: boolean;
    deletedAt?: Date | null;
  }): ChatMember {
    return new ChatMember(
      params.id,
      params.imageUrl,
      params.firstName,
      params.lastName,
      params.role,
      params.isDeleted,
      params.deletedAt,
    );
  }

  updateRole(role: ChatMemberRole): ChatMember {
    return new ChatMember(
      this._id,
      this._imageUrl,
      this._firstName,
      this._lastName,
      role,
      this._isDeleted,
      this._deletedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string | null {
    return this._lastName;
  }

  get role(): ChatMemberRole {
    return this._role;
  }

  get isDeleted(): boolean | undefined {
    return this._isDeleted;
  }

  get deletedAt(): Date | null | undefined {
    return this._deletedAt;
  }

  toJSON() {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      imageUrl: this._imageUrl,
      role: this._role,
    };
  }
}
