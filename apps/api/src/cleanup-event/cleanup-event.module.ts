import { Module } from '@nestjs/common';
import { CleanupEventController } from './cleanup-event.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RedisModule } from '../redis/redis.module';
import { CreateCleanupEventUseCase } from './application/use-cases/create-cleanup-event.use-case';
import { DeleteCleanupEventUseCase } from './application/use-cases/delete-cleanup-event.use-case';
import { GetCleanupEventUseCase } from './application/use-cases/get-cleanup-event.use-case';
import { GetCleanupEventsUseCase } from './application/use-cases/get-cleanup-events.use-case';
import { UpdateCleanupEventUseCase } from './application/use-cases/update-cleanup-event.use-case';
import { CleanupEventRepositoryImpl } from './infrastructure/repositories/cleanup-event.repository';
import { LocationValidationService } from '../domain/services/location-validation.service';
import { IsPointInRegionUseCase } from '../region/application/use-cases/is-point-in-region.use-case';
import { IsPointInsideSettlementUseCase } from '../settlement/application/use-cases/is-point-in-settlement.use-case';
import { RegionModule } from '../region/region.module';
import { SettlementModule } from '../settlement/settlement.module';
import { OverpassModule } from '../overpass/overpass.module';

@Module({
  imports: [RedisModule, RegionModule, SettlementModule, OverpassModule],
  controllers: [CleanupEventController],
  providers: [
    PrismaService,
    CreateCleanupEventUseCase,
    DeleteCleanupEventUseCase,
    GetCleanupEventUseCase,
    GetCleanupEventsUseCase,
    UpdateCleanupEventUseCase,
    {
      provide: 'CLEANUP_EVENT_REPOSITORY',
      useClass: CleanupEventRepositoryImpl,
    },
    LocationValidationService,
  ],
})
export class CleanupEventModule {}
