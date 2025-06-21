import { IRegionRepository } from './region-repository.interface';
import { Region } from './region.entity';
import { PrismaService } from '../shared';
import { Injectable } from '@nestjs/common';
import { Location } from '@ecorally/shared';

@Injectable()
export class RegionRepository implements IRegionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string): Promise<Region | null> {
    const region = await this.prismaService.region.findUnique({ where: { id } });

    if (!region) return null;

    return Region.fromPersistence(
      region.id,
      region.name,
      Location.create(region.latitude, region.longitude),
    );
  }
}
