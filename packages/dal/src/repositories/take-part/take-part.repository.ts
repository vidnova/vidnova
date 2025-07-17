import { ITakePartRepository } from './take-part-repository.interface';
import { PrismaService } from '../shared';
import { TakePart } from './take-part.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TakePartRepository implements ITakePartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(takePart: TakePart): Promise<TakePart> {
    const createdTakePart = await this.prismaService.takePart.create({ data: takePart });

    return TakePart.fromPersistence(createdTakePart);
  }

  async findByUserAndEventIds(eventId: string, userId: string): Promise<TakePart | null> {
    const takePart = await this.prismaService.takePart.findFirst({
      where: {
        eventId,
        userId,
      },
    });

    if (!takePart) return null;

    return TakePart.fromPersistence(takePart);
  }

  async delete(takePartId: string): Promise<void> {
    await this.prismaService.takePart.delete({ where: { id: takePartId } });
  }

  async findById(takePartId: string): Promise<TakePart | null> {
    const takePart = await this.prismaService.takePart.findUnique({ where: { id: takePartId } });

    if (!takePart) return null;

    return TakePart.fromPersistence(takePart);
  }
}
