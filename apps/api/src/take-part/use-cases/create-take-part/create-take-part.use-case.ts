import { ITakePartRepository, TakePart } from '@ecorally/dal';
import {
  ConflictException,
  HttpException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTakePartCommand } from './create-take-part.command';

export class CreateTakePartUseCase {
  constructor(
    @Inject('TAKE_PART_REPOSITORY') private readonly takePartRepository: ITakePartRepository,
  ) {}

  async execute(command: CreateTakePartCommand) {
    try {
      const isTakePartAlreadyExist = await this.takePartRepository.findByUserAndEventIds(
        command.eventId,
        command.userId,
      );

      if (isTakePartAlreadyExist) {
        throw new ConflictException('You are already taking part in this event.');
      }

      const takePart = TakePart.create({ ...command });

      return this.takePartRepository.create(takePart);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to create take part.');
    }
  }
}
