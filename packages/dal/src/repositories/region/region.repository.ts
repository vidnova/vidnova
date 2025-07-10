import { IRegionRepository } from './region-repository.interface';
import { Region } from './region.entity';
import { PrismaService } from '../shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegionRepository implements IRegionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string): Promise<Region | null> {
    const region = await this.prismaService.region.findUnique({ where: { id } });

    if (!region) return null;

    return Region.fromPersistence(region.id, region.name, region.longitude, region.latitude);
  }
}
