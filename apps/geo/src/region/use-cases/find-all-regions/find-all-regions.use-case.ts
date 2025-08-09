import { ILike, Repository } from 'typeorm';
import { Region } from '../../entities/region.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllRegionsCommand } from './find-all-regions.command';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class FindAllRegionsUseCase {
  private logger = new Logger(FindAllRegionsUseCase.name);

  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async execute(command: FindAllRegionsCommand) {
    try {
      const where = command.name
        ? [
            { name: ILike(`%${command.name}%`) },
            { nameEn: ILike(`%${command.name}%`) },
          ]
        : {};
      const [regions, count] = await Promise.all([
        this.regionRepository.find({
          skip: (command.page - 1) * command.pageSize,
          take: command.pageSize,
          order: { ['name']: command.sortOrder },
          select: ['id', 'name', 'nameEn'],
          where,
        }),
        this.regionRepository.count({ where }),
      ]);

      return { regions, count };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
