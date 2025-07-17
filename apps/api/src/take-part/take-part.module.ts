import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { USE_CASES } from './use-cases';
import { TakePartController } from './take-part.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
  controllers: [TakePartController],
})
export class TakePartModule {}
