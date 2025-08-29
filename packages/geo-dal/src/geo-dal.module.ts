import { Global, Module } from '@nestjs/common';
import { Settlement, SettlementRepository } from './settlement';
import { Region, RegionRepository } from './region';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Region, Settlement]),
    TypeOrmModule.forRoot({
      ...(databaseConfig as TypeOrmModuleOptions),
      autoLoadEntities: true,
    }),
  ],
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
