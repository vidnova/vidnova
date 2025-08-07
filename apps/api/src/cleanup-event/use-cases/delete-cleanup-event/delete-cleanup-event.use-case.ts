import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteCleanupEventCommand } from './delete-cleanup-event.command';
import { ICleanupEventRepository } from '@vidnova/dal';

@Injectable()
export class DeleteCleanupEventUseCase {
  constructor(
    @Inject('CLEANUP_EVENT_REPOSITORY')
    private readonly cleanupEventRepository: ICleanupEventRepository,
  ) {}

  async execute(command: DeleteCleanupEventCommand): Promise<string> {
    try {
      const cleanupEvent = await this.cleanupEventRepository.getById(command.cleanupEventId);

      if (!cleanupEvent) {
        throw new NotFoundException(`Cleanup event with id ${command.cleanupEventId} not found`);
      }

      if (command.userId !== cleanupEvent.id) {
        throw new ForbiddenException('Have no access to change this content');
      }

      await this.cleanupEventRepository.delete(command.cleanupEventId);

      return 'Cleanup event was deleted successfully';
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        `Failed to delete a cleanup event: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
