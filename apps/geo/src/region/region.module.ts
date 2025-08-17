import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { USE_CASES } from './use-cases';

@Module({
  providers: [...USE_CASES],
  controllers: [RegionController],
})
export class RegionModule {}
