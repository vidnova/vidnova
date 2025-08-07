import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetCleanupEventsCommand } from './get-cleanup-events.command';
import { ICleanupEventRepository } from '@vidnova/dal';

@Injectable()
export class GetCleanupEventsUseCase {
  constructor(
    @Inject('CLEANUP_EVENT_REPOSITORY')
    private readonly cleanupEventRepository: ICleanupEventRepository,
  ) {}

  async execute(command?: GetCleanupEventsCommand) {
    try {
      return this.cleanupEventRepository.getAll(command);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to receive a cleanup events: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
