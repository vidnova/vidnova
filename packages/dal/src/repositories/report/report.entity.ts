import { ReportStatus, ReportTargetType } from '@ecorally/shared';
import { v4 } from 'uuid';

export class Report {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _targetType: ReportTargetType,
    private readonly _targetId: string,
    private readonly _reason: string,
    private readonly _description: string | null,
    private readonly _status: ReportStatus,
    private readonly _createdAt: Date,
  ) {}

  static create(params: {
    userId: string;
    targetType: ReportTargetType;
    targetId: string;
    reason: string;
    description: string | null;
  }): Report {
    return new Report(
      v4(),
      params.userId,
      params.targetType,
      params.targetId,
      params.reason,
      params.description,
      ReportStatus.PENDING,
      new Date(),
    );
  }

  static fromPersistence(params: {
    id: string;
    userId: string;
    targetType: ReportTargetType;
    targetId: string;
    reason: string;
    description: string | null;
    status: ReportStatus;
    createdAt: Date;
  }): Report {
    return new Report(
      params.id,
      params.userId,
      params.targetType,
      params.targetId,
      params.reason,
      params.description,
      params.status,
      params.createdAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get targetType(): ReportTargetType {
    return this._targetType;
  }

  get targetId(): string {
    return this._targetId;
  }

  get reason(): string {
    return this._reason;
  }

  get description(): string | null {
    return this._description;
  }

  get status(): ReportStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
