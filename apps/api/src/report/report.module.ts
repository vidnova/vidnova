import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { USE_CASES } from './use-cases';

@Module({
  controllers: [ReportController],
  providers: [...USE_CASES],
})
export class ReportModule {}
