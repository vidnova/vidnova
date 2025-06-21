import { Module } from '@nestjs/common';
import { CleanupEventController } from './cleanup-event.controller';
import { CreateCleanupEventUseCase } from './use-cases/create-cleanup-event/create-cleanup-event.use-case';
import { DeleteCleanupEventUseCase } from './use-cases/delete-cleanup-event/delete-cleanup-event.use-case';
import { GetCleanupEventUseCase } from './use-cases/get-cleanup-event/get-cleanup-event.use-case';
import { GetCleanupEventsUseCase } from './use-cases/get-cleanup-events/get-cleanup-events.use-case';
import { UpdateCleanupEventUseCase } from './use-cases/update-cleanup-event/update-cleanup-event.use-case';
import { RegionModule } from '../region/region.module';
import { SettlementModule } from '../settlement/settlement.module';
import { CleanupEventRepository, PrismaService, RedisService } from '@ecorally/dal';
import { LocationValidationService } from '@ecorally/shared';
import { DatabaseModule } from '../database/database.module';
import { IsPointInRegionUseCase } from '../region/use-cases/is-point-in-region/is-point-in-region.use-case';
import { IsPointInsideSettlementUseCase } from '../settlement/use-cases/is-point-inside-settlement/is-point-in-settlement.use-case';

@Module({
  imports: [DatabaseModule, SettlementModule, RegionModule],
  controllers: [CleanupEventController],
  providers: [
    PrismaService,
    RedisService,
    CreateCleanupEventUseCase,
    DeleteCleanupEventUseCase,
    GetCleanupEventUseCase,
    GetCleanupEventsUseCase,
    UpdateCleanupEventUseCase,
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
