export class CleanupEventQueries {
  static readonly SELECT_FIELDS = {
    id: true,
    name: true,
    description: true,
    startDate: true,
    endDate: true,
    status: true,
    imageUrl: true,
    organizerId: true,
    createdAt: true,
    organizer: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
      },
    },
    location: {
      select: {
        id: true,
        latitude: true,
        longitude: true,
        region: {
          select: {
            id: true,
            latitude: true,
            longitude: true,
            name: true,
          },
        },
        settlement: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    },
    dates: {
      select: {
        date: true,
      },
    },
    equipments: {
      select: {
        equipment: { select: { id: true, name: true } },
        quantity: true,
      },
    },
    takePart: {
      select: {
        id: true,
        user: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
      },
    },
  } as const;

  static readonly SELECT_PREVIEW_FIELDS = {
    id: true,
    name: true,
    startDate: true,
    endDate: true,
    status: true,
    imageUrl: true,
    location: {
      select: {
        settlement: {
          select: {
            id: true,
            name: true,
          },
        },
        region: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    organizer: {
      select: {
        id: true,
        imageUrl: true,
      },
    },
  } as const;
}
