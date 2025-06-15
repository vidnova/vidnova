import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisModule } from '../redis/redis.module';
import { OverpassModule } from '../overpass/overpass.module';
import { IsPointInRegionUseCase } from './application/use-cases/is-point-in-region.use-case';
import { RegionRepositoryImpl } from './infrastructure/repositories/region.repository';

@Module({
  imports: [RedisModule, OverpassModule],
  providers: [
    PrismaService,
    IsPointInRegionUseCase,
    {
      provide: 'REGION_REPOSITORY',
      useClass: RegionRepositoryImpl,
    },
    {
      provide: 'IS_POINT_INSIDE_REGION',
      useClass: IsPointInRegionUseCase,
    },
  ],
  exports: ['IS_POINT_INSIDE_REGION'],
})
export class RegionModule {}
