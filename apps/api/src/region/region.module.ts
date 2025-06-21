import { Module } from '@nestjs/common';
import { USE_CASES } from './use-cases';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class RegionModule {}
