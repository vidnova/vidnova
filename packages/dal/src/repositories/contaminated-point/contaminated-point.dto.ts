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
    settlement: {
      id?: string | undefined;
      name?: string | undefined;
    };
    region: {
      id?: string | undefined;
      name?: string | undefined;
    };
  };
  creator: {
    id: string;
    name: string;
  };
}

export interface ContaminatedPointSummaryDto {
  id: string;
  name: string;
  imageUrl: string;
  status: ContaminatedPointStatusEnum;
  location: {
    settlement: {
      id?: string | undefined;
      name?: string | undefined;
    };
    region: {
      id?: string | undefined;
      name?: string | undefined;
    };
  };
  creator: {
    id: string;
    name: string;
  };
}
