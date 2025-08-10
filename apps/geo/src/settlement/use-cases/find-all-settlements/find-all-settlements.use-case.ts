import { ILike, Repository } from 'typeorm';
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
      const nameFilter = command.name
        ? [
            { name: ILike(`%${command.name}%`), regionId: command.region },
            { nameEn: ILike(`%${command.name}%`), regionId: command.region },
          ]
        : { regionId: command.region };

      const [settlements, count] = await this.settlementRepository.findAndCount(
        {
          skip: (command.page - 1) * command.pageSize,
          take: command.pageSize,
          order: { name: command.sortOrder },
          select: ['id', 'name', 'nameEn'],
          where: nameFilter,
        },
      );

      return { settlements, count };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
