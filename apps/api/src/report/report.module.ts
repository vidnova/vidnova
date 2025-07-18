import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { DatabaseModule } from '../database/database.module';
import { USE_CASES } from './use-cases';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportController],
  providers: [...USE_CASES],
})
export class ReportModule {}
