import { PrismaService } from '../../../prisma/prisma.service';
import { RegionRepository } from '../../domain/interfaces/region.repository.interface';
import { Region } from '../../../domain/value-objects/region.vo';
import { Location } from '../../../domain/value-objects/location.vo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegionRepositoryImpl implements RegionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<Region | null> {
    const region = await this.prisma.region.findUnique({ where: { id } });

    if (!region) return null;

    return Region.fromPersistence(
      region.id,
      region.name,
      Location.create(region.latitude, region.longitude),
    );
  }
}
