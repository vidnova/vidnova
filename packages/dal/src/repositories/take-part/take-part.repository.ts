import { ITakePartRepository } from './take-part-repository.interface';
import { PrismaService } from '../shared';
import { TakePart } from './take-part.entity';

export class TakePartRepository implements ITakePartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(takePart: TakePart): Promise<TakePart> {
    const createdTakePart = await this.prismaService.takePart.create({ data: takePart });

    return TakePart.fromPersistence(createdTakePart);
  }
}
