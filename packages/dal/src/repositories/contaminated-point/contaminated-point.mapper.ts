import { ContaminatedPointDto, ContaminatedPointSummaryDto } from './contaminated-point.dto';
import { ContaminatedPointStatusEnum } from './contaminated-point-status.enum';
import { Prisma } from '@prisma/client';
import { ContaminatedPointQueries } from './contaminated-point.query';

type ContaminatedPointSelectResult = Prisma.ContaminatedPointGetPayload<{
  select: typeof ContaminatedPointQueries.SELECT_FIELDS;
}>;

type ContaminatedPointPreviewSelectResult = Prisma.ContaminatedPointGetPayload<{
  select: typeof ContaminatedPointQueries.SELECT_FIELDS_PREVIEW;
}>;

export class ContaminatedPointMapper {
  static toFullContent(data: ContaminatedPointSelectResult): ContaminatedPointDto {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      status: data.status as ContaminatedPointStatusEnum,
      creator: {
        id: data.creator.id,
        name: data.creator.name,
      },
      location: {
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
        region: {
          id: data.location?.region.id,
          name: data.location?.region.name,
        },
        settlement: {
          id: data.location?.settlement?.id,
          name: data.location?.settlement?.name,
        },
      },
    };
  }

  static toPreview(data: ContaminatedPointPreviewSelectResult): ContaminatedPointSummaryDto {
    return {
      id: data.id,
      name: data.name,
      imageUrl: data.imageUrl,
      status: data.status as ContaminatedPointStatusEnum,
      creator: {
        id: data.creator.id,
        name: data.creator.name,
      },
      location: {
        region: {
          id: data.location?.region.id,
          name: data.location?.region.name,
        },
        settlement: {
          id: data.location?.settlement?.id,
          name: data.location?.settlement?.name,
        },
      },
    };
  }
}
