import { ChatType } from '@ecorally/shared';

export interface ChatPreviewDto {
  id: string;
  name: string;
  imageUrl: string;
  type: ChatType;
}

export interface ChatWithMembersPersistenceDto {
  id: string;
  name: string | null;
  imageUrl: string;
  type: ChatType;
  updatedAt: Date;
  members: {
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string | null;
      imageUrl: string;
    };
  }[];
}
