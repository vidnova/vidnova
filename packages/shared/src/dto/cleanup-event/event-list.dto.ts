import { CleanupEventStatus } from '../../types';

export class CleanupEventListDto {
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
      } | null;
      region: {
        id: string;
        name: string;
      };
    } | null,
    public organizer: {
      id: string;
      name: string;
    },
  ) {}
}
