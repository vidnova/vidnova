import { Module } from '@nestjs/common';
import { ContaminatedPointService } from './contaminated-point.service';
import { ContaminatedPointController } from './contaminated-point.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RegionService } from '../region/region.service';
import { SettlementService } from '../settlement/settlement.service';
import { RedisModule } from '../redis/redis.module';
import { OsmModule } from '../overpass/overpass.module';

@Module({
  imports: [RedisModule, OsmModule],
  controllers: [ContaminatedPointController],
  providers: [
    ContaminatedPointService,
    PrismaService,
    RegionService,
    SettlementService,
  ],
})
export class ContaminatedPointModule {}
