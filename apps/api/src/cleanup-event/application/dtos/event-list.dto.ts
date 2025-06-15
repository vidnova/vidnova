import { CleanupEventStatus } from '@ecorally/shared';

export class EventListDto {
  constructor(
    public id: string,
    public name: string,
    public startDate: Date,
    public endDate: Date,
    public status: CleanupEventStatus,
    public imageUrl: string,
    public location: {
      settlement: {
        id: string;
        name: string;
      };
      region: {
        id: string;
        name: string;
      };
    },
    public organizer: {
      id: string;
      name: string;
    },
  ) {}
}
