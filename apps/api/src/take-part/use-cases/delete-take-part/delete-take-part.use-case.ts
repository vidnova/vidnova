import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ITakePartRepository } from '@vidnova/dal';
import { DeleteTakePartCommand } from './delete-take-part.command';

@Injectable()
export class DeleteTakePartUseCase {
  constructor(
    @Inject('TAKE_PART_REPOSITORY') private readonly takePartRepository: ITakePartRepository,
  ) {}

  async execute(command: DeleteTakePartCommand) {
    try {
      const takePart = await this.takePartRepository.findById(command.takePartId);

      if (!takePart) {
        throw new NotFoundException(`Participation with ID ${command.takePartId} not found.`);
      }

      if (command.userId !== takePart.userId) {
        throw new ForbiddenException('You have no access to change this content');
      }

      await this.takePartRepository.delete(command.takePartId);

      return 'Participation removed';
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to remove partition');
    }
  }
}
