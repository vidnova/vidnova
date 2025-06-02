export class CleanupEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly status: string,
    public readonly imageUrl: string,
    public readonly organizerId: string,
    public readonly location: {
      latitude: number;
      longitude: number;
      settlement?: {
        name: string;
        latitude: number;
        longitude: number;
      };
      region: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
      };
    },
    public readonly dates: { date: Date }[],
    public readonly equipments: { equipment: { id: string; name: string }; quantity: number }[],
  ) {}

  static create(params: {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: string;
    imageUrl: string;
    organizerId: string;
    location: {
      latitude: number;
      longitude: number;
      settlement?: {
        name: string;
        latitude: number;
        longitude: number;
      };
      region: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
      };
    };
    dates: { date: Date }[];
    equipments: {
      equipment: {
        id: string;
        name: string;
      };
      quantity: number;
    }[];
  }): CleanupEvent {
    return new CleanupEvent(
      params.id,
      params.name,
      params.description,
      params.startDate,
      params.endDate,
      params.status,
      params.imageUrl,
      params.organizerId,
      {
        latitude: params.location.latitude,
        longitude: params.location.longitude,
        settlement: params.location.settlement || undefined,
        region: params.location.region,
      },
      params.dates.map((date) => ({ date: date.date })),
      params.equipments.map((equipment) => ({
        equipment: {
          id: equipment.equipment.id,
          name: equipment.equipment.name,
        },
        quantity: equipment.quantity,
      })),
    );
  }

  isValidDateRange(): boolean {
    return this.startDate <= this.endDate;
  }

  isValidEventDates(): boolean {
    return this.dates.every((date) => date.date >= this.startDate && date.date <= this.endDate);
  }
}
