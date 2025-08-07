import { IReportRepository } from './report-repository.interface';
import { PrismaService } from '../shared';
import { Report } from './report.entity';
import { ReportStatus, ReportTargetType } from '@vidnova/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportRepository implements IReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(report: Report): Promise<Report> {
    const createdReport = await this.prismaService.report.create({
      data: report,
    });

    return Report.fromPersistence({
      ...createdReport,
      targetType: createdReport.targetType as ReportTargetType,
      status: createdReport.status as ReportStatus,
    });
  }
}
