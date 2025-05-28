import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertContaminatedPointDto } from './dto/upsert-contaminated-point.dto';
import { RegionService } from '../region/region.service';
import { SettlementService } from '../settlement/settlement.service';

@Injectable()
export class ContaminatedPointService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly regionService: RegionService,
    private readonly settlementService: SettlementService,
  ) {}

  async createContaminatedPoint(
    data: UpsertContaminatedPointDto,
    userId: string,
  ) {
    try {
      let isPointInsideCorrectRegion: boolean = false;
      let isPointInsideCorrectSettlement: boolean = false;

      isPointInsideCorrectRegion = await this.regionService.isPointInRegion(
        data.latitude,
        data.longitude,
        data.regionId,
      );

      if (!isPointInsideCorrectRegion) {
        throw new ConflictException(
          'The selected point is outside the selected region.',
        );
      }

      if (data.settlementId) {
        isPointInsideCorrectSettlement =
          await this.settlementService.isPointInSettlement(
            data.latitude,
            data.longitude,
            data.settlementId,
          );
      }

      if (!isPointInsideCorrectSettlement) {
        throw new ConflictException(
          'The selected point is outside the selected settlement.',
        );
      }

      return this.prisma.contaminatedPoint.create({
        data: {
          ...data,
          creatorId: userId,
        },
      });
      // eslint-disable-next-line
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create a contaminated point.',
      );
    }
  }

  async getContaminatedPoint(contaminatedPointId: string) {
    try {
      const contaminatedPoint = await this.prisma.contaminatedPoint.findUnique({
        where: { id: contaminatedPointId },
        select: {
          settlement: true,
        },
      });

      if (!contaminatedPoint) {
        throw new NotFoundException('Contaminated point not found.');
      }

      return contaminatedPoint;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to retrieve the contaminated point.',
      );
    }
  }
}
