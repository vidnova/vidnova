import {
  ICleanupEventRepository,
  ICommentRepository,
  IContaminatedPointRepository,
  IReportRepository,
  Report,
} from '@ecorally/dal';
import { CreateReportCommand } from './create-report.command';
import {
  BadRequestException,
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReportTargetType } from '@ecorally/shared';

export class CreateReportUseCase {
  constructor(
    @Inject('REPORT_REPOSITORY')
    private readonly reportRepository: IReportRepository,
    @Inject('CLEANUP_EVENT_REPOSITORY')
    private readonly cleanupEventRepository: ICleanupEventRepository,
    @Inject('CONTAMINATED_POINT_REPOSITORY')
    private readonly contaminatedPointRepository: IContaminatedPointRepository,
    @Inject('COMMENT_REPOSITORY')
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: CreateReportCommand) {
    try {
      await this.validateTargetExists(command.targetType, command.targetId);

      const report = Report.create(command);

      return this.reportRepository.create(report);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to create report');
    }
  }

  private async validateTargetExists(type: ReportTargetType, id: string) {
    switch (type) {
      case ReportTargetType.CLEANUP_EVENT: {
        const exists = await this.cleanupEventRepository.getById(id);
        if (!exists) throw new NotFoundException('Cleanup event not found');
        break;
      }
      case ReportTargetType.CONTAMINATED_POINT: {
        const exists = await this.contaminatedPointRepository.findById(id);
        if (!exists) throw new NotFoundException('Contaminated point not found');
        break;
      }
      case ReportTargetType.COMMENT: {
        const exists = await this.commentRepository.findById(id);
        if (!exists) throw new NotFoundException('Comment not found');
        break;
      }
      default:
        throw new BadRequestException('Unsupported target type');
    }
  }
}
