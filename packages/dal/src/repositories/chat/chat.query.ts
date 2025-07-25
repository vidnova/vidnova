export class ChatQueries {
  static readonly SELECT_FIELDS = {
    id: true,
    name: true,
    description: true,
    type: true,
    imageUrl: true,
    members: {
      select: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        role: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  } as const;
}
