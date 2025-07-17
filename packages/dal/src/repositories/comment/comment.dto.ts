export interface CommentDto {
  id: string;
  eventId: string;
  content: string;
  user: {
    id: string;
    imageUrl: string;
    firstName: string;
    lastName: string | null;
  };
}
