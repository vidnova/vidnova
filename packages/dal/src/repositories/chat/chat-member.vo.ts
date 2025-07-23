import { ChatMemberRole } from '@ecorally/shared';

export class ChatMember {
  constructor(
    private readonly _id: string,
    private readonly _imageUrl: string,
    private readonly _firstName: string,
    private readonly _lastName: string | null,
    private readonly _role: ChatMemberRole,
  ) {}

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
}
