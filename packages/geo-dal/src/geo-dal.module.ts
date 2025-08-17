import { Global, Module } from '@nestjs/common';
import { Settlement, SettlementRepository } from './settlement';
import { Region, RegionRepository } from './region';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Region, Settlement])],
  providers: [
    {
      provide: 'SETTLEMENT_REPOSITORY',
      useClass: SettlementRepository,
    },
    {
      provide: 'REGION_REPOSITORY',
      useClass: RegionRepository,
    },
  ],
  exports: ['SETTLEMENT_REPOSITORY', 'REGION_REPOSITORY'],
})
export class GeoDalModule {}
