export interface CommentDto {
  id: string;
  eventId: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
}