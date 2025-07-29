import { Module } from '@nestjs/common';
import { USE_CASES } from './use-cases';
import { SettlementController } from './settlement.controller';

@Module({
  providers: [...USE_CASES],
  exports: [],
  controllers: [SettlementController],
})
export class SettlementModule {}
