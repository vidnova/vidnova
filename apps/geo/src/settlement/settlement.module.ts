import { Module } from '@nestjs/common';
import { SettlementController } from './settlement.controller';
import { Settlement } from '../../../../packages/geo-dal/src/settlement/settlement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USE_CASES } from './use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([Settlement])],
  controllers: [SettlementController],
  providers: [...USE_CASES],
})
export class SettlementModule {}
