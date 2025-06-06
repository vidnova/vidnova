import { Module } from '@nestjs/common';
import { CleanupEventService } from './cleanup-event.service';
import { CleanupEventController } from './cleanup-event.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RedisModule } from '../redis/redis.module';
import { SettlementService } from '../settlement/settlement.service';
import { OsmModule } from '../overpass/overpass.module';
import { RegionService } from 'src/region/region.service';

@Module({
  imports: [RedisModule, OsmModule],
  controllers: [CleanupEventController],
  providers: [
    CleanupEventService,
    PrismaService,
    SettlementService,
    RegionService,
  ],
})
export class CleanupEventModule {}
