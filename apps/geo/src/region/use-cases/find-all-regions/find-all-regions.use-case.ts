import { FindOptionsWhere, ILike, Repository } from 'typeorm';
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
      const trimmedName = command.name?.trim();
      const where: FindOptionsWhere<Region>[] | object = trimmedName
        ? [
            { name: ILike(`%${trimmedName}%`) },
            { nameEn: ILike(`%${trimmedName}%`) },
          ]
        : {};

      const skip = (command.page - 1) * command.pageSize;
      const take = command.pageSize + 1;

      const regions = await this.regionRepository.find({
        skip,
        take,
        order: { ['name']: command.sortOrder },
        select: ['id', 'name', 'nameEn'],
        where,
      });
      const hasMore = regions.length > command.pageSize;

      return {
        regions: hasMore ? regions.slice(0, command.pageSize) : regions,
        hasMore,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
