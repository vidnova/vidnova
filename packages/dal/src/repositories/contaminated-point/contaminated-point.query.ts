export class ContaminatedPointQueries {
  static readonly SELECT_FIELDS = {
    id: true,
    name: true,
    description: true,
    imageUrl: true,
    status: true,
    location: {
      select: {
        latitude: true,
        longitude: true,
        region: {
          select: {
            id: true,
            name: true,
          },
        },
        settlement: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    creator: {
      select: {
        id: true,
        name: true,
      },
    },
  };
}
