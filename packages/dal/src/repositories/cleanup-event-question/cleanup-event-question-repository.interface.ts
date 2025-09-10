import { CleanupEventQuestion } from './cleanup-event-question.entity';

export interface ICleanupEventQuestionRepository {
  createMany(cleanupEventQuestions: CleanupEventQuestion[]): Promise<CleanupEventQuestion[]>;
}
