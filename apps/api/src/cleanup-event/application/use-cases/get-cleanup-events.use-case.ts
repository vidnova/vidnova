import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CleanupEventRepository } from '../../domain/interfaces/cleanup-event-repository.interface';
import { GetCleanupEventsCommand } from '../commands/get-cleanup-events.command';

@Injectable()
export class GetCleanupEventsUseCase {
  constructor(
    @Inject('CLEANUP_EVENT_REPOSITORY')
    private readonly cleanupEventRepository: CleanupEventRepository,
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
