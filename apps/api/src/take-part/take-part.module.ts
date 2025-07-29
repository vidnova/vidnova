import { Module } from '@nestjs/common';
import { USE_CASES } from './use-cases';
import { TakePartController } from './take-part.controller';

@Module({
  providers: [...USE_CASES],
  exports: [...USE_CASES],
  controllers: [TakePartController],
})
export class TakePartModule {}
