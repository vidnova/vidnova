import { Report } from './report.entity';

export interface IReportRepository {
  create(report: Report): Promise<Report>;
}
