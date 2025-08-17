import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { USE_CASES } from './use-cases';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from '../../../../packages/geo-dal/src/region/region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  providers: [...USE_CASES],
  controllers: [RegionController],
})
export class RegionModule {}
