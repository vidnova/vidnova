import { ContaminatedPointDto } from './contaminated-point.dto';
import { ContaminatedPointStatusEnum } from './contaminated-point-status.enum';
import { Prisma } from '@prisma/client';
import { ContaminatedPointQueries } from './contaminated-point.query';

type ContaminatedPointSelectResult = Prisma.ContaminatedPointGetPayload<{
  select: typeof ContaminatedPointQueries.SELECT_FIELDS;
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
        regionId: data.location?.region.id,
        regionName: data.location?.region.name,
        settlementId: data.location?.settlement?.id,
        settlementName: data.location?.settlement?.name,
      },
    };
  }
}
