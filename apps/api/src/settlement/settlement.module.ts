import { Module } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisModule } from '../redis/redis.module';
import { OsmModule } from '../overpass/overpass.module';

@Module({
  imports: [RedisModule, OsmModule],
  providers: [SettlementService, PrismaService],
})
export class SettlementModule {}
