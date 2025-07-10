import { ContaminatedPointStatusEnum } from './contaminated-point-status.enum';

export interface ContaminatedPointDto {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: ContaminatedPointStatusEnum;
  location: {
    latitude: number | undefined;
    longitude: number | undefined;
    settlementId?: string | undefined;
    settlementName?: string | undefined;
    regionId: string | undefined;
    regionName: string | undefined;
  };
  creator: {
    id: string;
    name: string;
  };
}
