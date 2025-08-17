import { Module } from '@nestjs/common';
import { SettlementController } from './settlement.controller';
import { USE_CASES } from './use-cases';

@Module({
  controllers: [SettlementController],
  providers: [...USE_CASES],
})
export class SettlementModule {}
