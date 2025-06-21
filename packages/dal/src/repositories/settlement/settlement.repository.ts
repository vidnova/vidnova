import { ISettlementRepository } from './settlement-repository.interface';
import { Settlement } from './settlement.entity';
import { Region } from '../region';
import { PrismaService } from '../shared';
import { Injectable } from '@nestjs/common';
import { Location } from '@ecorally/shared';

@Injectable()
export class SettlementRepository implements ISettlementRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string, options?: { includeRegion: boolean }): Promise<Settlement | null> {
    const settlement = await this.prismaService.settlement.findUnique({
      where: { id },
      include: { region: options && options.includeRegion },
    });

    if (!settlement) return null;

    const settlementLocation = Location.create(settlement.latitude, settlement.longitude);

    let region: Region | undefined;
    if (options?.includeRegion && settlement.region) {
      const regionLocation = Location.create(
        settlement.region.latitude,
        settlement.region.longitude,
      );
      region = Region.fromPersistence(settlement.region.id, settlement.region.name, regionLocation);
    }

    return Settlement.create(
      settlement.id,
      settlement.name,
      settlement.regionId,
      settlementLocation,
      region,
    );
  }
}
