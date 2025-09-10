import { v4 } from 'uuid';

export class CleanupEventQuestionOption {
  constructor(
    private readonly _id: string,
    private readonly _text: string,
    private readonly _order: number,
  ) {}

  static create(params: { text: string; order: number }): CleanupEventQuestionOption {
    return new CleanupEventQuestionOption(v4(), params.text, params.order);
  }

  static fromPersistence(params: {
    id: string;
    text: string;
    order: number;
  }): CleanupEventQuestionOption {
    return new CleanupEventQuestionOption(params.id, params.text, params.order);
  }

  get id(): string {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  get order(): number {
    return this._order;
  }
}
