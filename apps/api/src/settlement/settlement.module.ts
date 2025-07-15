import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { USE_CASES } from './use-cases';
import { SettlementController } from './settlement.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...USE_CASES],
  exports: [],
  controllers: [SettlementController],
})
export class SettlementModule {}
