import { ICleanupEventQuestionRepository } from './cleanup-event-question-repository.interface';
import { PrismaService } from '../shared';
import { CleanupEventQuestion } from './cleanup-event-question.entity';
import { CleanupEventQuestionOption } from './cleanup-event-question-option.vo';
import { CleanupEventQuestionType } from '@vidnova/shared';

export class CleanupEventQuestionRepository implements ICleanupEventQuestionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(cleanupEventQuestions: CleanupEventQuestion[]): Promise<CleanupEventQuestion[]> {
    const persistedQuestions = await this.batchCreateQuestions(cleanupEventQuestions);

    return persistedQuestions.map((question) => {
      const questionOptionsForThis = question.options.map((option) =>
        CleanupEventQuestionOption.fromPersistence(option),
      );

      return CleanupEventQuestion.fromPersistence({
        ...question,
        type: question.type as CleanupEventQuestionType,
        options: questionOptionsForThis,
      });
    });
  }

  private async batchCreateQuestions(questions: CleanupEventQuestion[]) {
    return this.prismaService.$transaction(async (tx) => {
      await tx.cleanupEventQuestion.createMany({
        data: questions.map((question) => ({
          id: question.id,
          text: question.text,
          type: question.type,
          order: question.order,
          required: question.required,
          eventId: question.eventId,
        })),
        skipDuplicates: true,
      });

      const allOptions = questions
        .filter((q) => q.options?.length)
        .flatMap((q) =>
          q.options!.map((option) => ({
            id: option.id,
            text: option.text,
            order: option.order,
            questionId: q.id,
          })),
        );

      if (allOptions.length > 0) {
        await tx.cleanupEventQuestionOption.createMany({
          data: allOptions,
          skipDuplicates: true,
        });
      }

      return tx.cleanupEventQuestion.findMany({
        where: {
          id: {
            in: questions.map((q) => q.id),
          },
        },
        include: {
          options: true,
        },
      });
    });
  }
}
