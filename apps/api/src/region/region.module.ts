import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisModule } from '../redis/redis.module';
import { OsmModule } from '../osm/osm.module';

@Module({
  imports: [RedisModule, OsmModule],
  providers: [RegionService, PrismaService],
})
export class RegionModule {}
