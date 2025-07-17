import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { USE_CASES } from './use-cases';

@Module({
  imports: [DatabaseModule],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class TakePartModule {}
