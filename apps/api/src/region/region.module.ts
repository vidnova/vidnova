import { Module } from '@nestjs/common';
import { USE_CASES } from './use-cases';
import { RegionController } from './region.controller';

@Module({
  controllers: [RegionController],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class RegionModule {}
