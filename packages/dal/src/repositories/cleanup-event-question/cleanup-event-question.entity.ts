import { CleanupEventQuestionType } from '@vidnova/shared';
import { v4 } from 'uuid';
import { CleanupEventQuestionOption } from './cleanup-event-question-option.vo';

export class CleanupEventQuestion {
  constructor(
    private readonly _id: string,
    private readonly _eventId: string,
    private readonly _type: CleanupEventQuestionType,
    private readonly _text: string,
    private readonly _order: number,
    private readonly _required: boolean,
    private readonly _options: CleanupEventQuestionOption[],
  ) {}

  static create(params: {
    eventId: string;
    type: CleanupEventQuestionType;
    text: string;
    order: number;
    required: boolean;
    options: CleanupEventQuestionOption[];
  }): CleanupEventQuestion {
    if (params.order < 1) {
      throw new Error('Order must be greater then 0');
    }

    if (params.text.length < 1) {
      throw new Error('Text length must be greater than 0');
    }

    return new CleanupEventQuestion(
      v4(),
      params.eventId,
      params.type,
      params.text,
      params.order,
      params.required,
      params.options,
    );
  }

  static fromPersistence(params: {
    id: string;
    eventId: string;
    type: CleanupEventQuestionType;
    text: string;
    order: number;
    required: boolean;
    options: CleanupEventQuestionOption[];
  }): CleanupEventQuestion {
    return new CleanupEventQuestion(
      params.id,
      params.eventId,
      params.type,
      params.text,
      params.order,
      params.required,
      params.options,
    );
  }

  get id(): string {
    return this._id;
  }

  get eventId(): string {
    return this._eventId;
  }

  get type(): CleanupEventQuestionType {
    return this._type;
  }

  get text(): string {
    return this._text;
  }

  get order(): number {
    return this._order;
  }

  get required(): boolean {
    return this._required;
  }

  get options(): CleanupEventQuestionOption[] {
    return this._options;
  }
}
