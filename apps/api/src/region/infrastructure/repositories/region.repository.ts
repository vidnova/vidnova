import { Region } from 'src/region/domain/entities/region.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegionRepository } from '../../domain/interfaces/region.repository.interface';

export class RegionRepositoryImpl implements RegionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<Region | null> {
    const region = await this.prisma.region.findUnique({ where: { id } });

    if (!region) return null;

    return Region.create(region);
  }
}
