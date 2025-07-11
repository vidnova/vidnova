import { Module } from '@nestjs/common';
import { USE_CASES } from './use-cases';
import { DatabaseModule } from '../database/database.module';
import { RegionController } from './region.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RegionController],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class RegionModule {}
