import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Settlement } from '../../entities/settlement.entity';
import { FindAllSettlementsCommand } from './find-all-settlements.command';

@Injectable()
export class FindAllSettlementsUseCase {
  private logger = new Logger(FindAllSettlementsUseCase.name);

  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
  ) {}

  async execute(command: FindAllSettlementsCommand) {
    try {
      const trimmedName = command.name?.trim();
      const where: FindOptionsWhere<Settlement>[] | object = trimmedName
        ? [
            { name: ILike(`%${trimmedName}%`) },
            { nameEn: ILike(`%${trimmedName}%`) },
          ]
        : {};

      const skip = (command.page - 1) * command.pageSize;
      const take = command.pageSize + 1;

      const settlements = await this.settlementRepository.find({
        skip,
        take,
        order: { ['name']: command.sortOrder },
        select: ['id', 'name', 'nameEn'],
        where,
      });
      const hasMore = settlements.length > command.pageSize;

      return { settlements, hasMore };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
