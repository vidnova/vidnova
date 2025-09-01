export class MessageReactionQuery {
  static readonly SELECT_FIELDS = {
    id: true,
    emoji: true,
    user: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
      },
    },
    createdAt: true,
  };
}
