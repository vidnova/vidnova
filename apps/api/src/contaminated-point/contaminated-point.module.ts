import { Module } from '@nestjs/common';
import { ContaminatedPointController } from './contaminated-point.controller';
import { DatabaseModule } from '../database/database.module';
import { USE_CASES } from './use-cases';
import { LocationValidationService } from '@ecorally/shared';
import { IsPointInRegionUseCase } from '../region/use-cases/is-point-in-region/is-point-in-region.use-case';
import { IsPointInsideSettlementUseCase } from '../settlement/use-cases/is-point-inside-settlement/is-point-in-settlement.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [ContaminatedPointController],
  providers: [
    ...USE_CASES,
    LocationValidationService,
    {
      provide: 'IS_POINT_INSIDE_REGION',
      useClass: IsPointInRegionUseCase,
    },
    {
      provide: 'IS_POINT_INSIDE_SETTLEMENT',
      useClass: IsPointInsideSettlementUseCase,
    },
  ],
})
export class ContaminatedPointModule {}
