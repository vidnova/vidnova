import { Module } from '@nestjs/common';
import { CleanupEventController } from './cleanup-event.controller';
import { RegionModule } from '../region/region.module';
import { SettlementModule } from '../settlement/settlement.module';
import { PrismaService } from '@vidnova/dal';
import { LocationValidationService, RedisService } from '@vidnova/shared';
import { IsPointInRegionUseCase } from '../region/use-cases/is-point-in-region/is-point-in-region.use-case';
import { IsPointInsideSettlementUseCase } from '../settlement/use-cases/is-point-inside-settlement/is-point-in-settlement.use-case';
import { USE_CASES } from './use-cases';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [SettlementModule, RegionModule, CommentModule],
  controllers: [CleanupEventController],
  providers: [
    PrismaService,
    RedisService,
    ...USE_CASES,
    {
      provide: 'IS_POINT_INSIDE_REGION',
      useClass: IsPointInRegionUseCase,
    },
    {
      provide: 'IS_POINT_INSIDE_SETTLEMENT',
      useClass: IsPointInsideSettlementUseCase,
    },
    LocationValidationService,
  ],
})
export class CleanupEventModule {}
