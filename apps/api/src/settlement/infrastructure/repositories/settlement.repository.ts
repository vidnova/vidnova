import { PrismaService } from '../../../prisma/prisma.service';
import { SettlementRepository } from '../../domain/interfaces/settlement-repository.interface';
import { Settlement } from '../../../domain/value-objects/settlement.vo';
import { Location } from '../../../domain/value-objects/location.vo';
import { Region } from '../../../domain/value-objects/region.vo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SettlementRepositoryImpl implements SettlementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string, options?: { includeRegion: boolean }): Promise<Settlement | null> {
    const settlement = await this.prisma.settlement.findUnique({
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
