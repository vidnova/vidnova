import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { USE_CASES } from './use-cases';
import { RedisService } from '@vidnova/shared';

@Module({
  providers: [...USE_CASES, RedisService],
  controllers: [RegionController],
})
export class RegionModule {}
