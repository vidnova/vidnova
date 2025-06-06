import { CleanupEventStatus } from '../enum/cleanup-event-status.dto';

export type UpsertCleanupEventDto = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: CleanupEventStatus;
  imageUrl: string;
  settlementId?: string;
  regionId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  dates: {
    date: Date;
  }[];
  equipments: {
    equipmentId: string;
    quantity: number;
  }[];
};
