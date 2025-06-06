import { Settlement } from '../../domain/entities/settlement.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { SettlementRepository } from '../../domain/interfaces/settlement-repository.interface';
import { Region } from '../../../region/domain/entities/region.entity';

export class SettlementRepositoryImpl implements SettlementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string, options?: { includeRegion: boolean }): Promise<Settlement | null> {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id },
      include: { region: options.includeRegion },
    });

    if (!settlement) return null;

    return Settlement.create({
      ...settlement,
      region: settlement.region && Region.create(settlement.region),
    });
  }
}
