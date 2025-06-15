import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisModule } from '../redis/redis.module';
import { OverpassModule } from '../overpass/overpass.module';
import { IsPointInsideSettlementUseCase } from './application/use-cases/is-point-in-settlement.use-case';
import { SettlementRepositoryImpl } from './infrastructure/repositories/settlement.repository';

@Module({
  imports: [RedisModule, OverpassModule],
  providers: [
    PrismaService,
    IsPointInsideSettlementUseCase,
    {
      provide: 'SETTLEMENT_REPOSITORY',
      useClass: SettlementRepositoryImpl,
    },
    {
      provide: 'IS_POINT_INSIDE_SETTLEMENT',
      useClass: IsPointInsideSettlementUseCase,
    },
  ],
  exports: ['IS_POINT_INSIDE_SETTLEMENT'],
})
export class SettlementModule {}
