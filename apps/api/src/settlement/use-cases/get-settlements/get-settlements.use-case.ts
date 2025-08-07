import { ISettlementRepository } from '@vidnova/dal';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { GetSettlementsCommand } from './get-settlements.command';

export class GetSettlementsUseCase {
  constructor(
    @Inject('SETTLEMENT_REPOSITORY') private readonly settlementsRepository: ISettlementRepository,
  ) {}

  async execute(command: GetSettlementsCommand) {
    try {
      return this.settlementsRepository.getAll(
        { name: command.name, region: command.region },
        {
          page: command.page,
          pageSize: command.pageSize,
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to get settlements');
    }
  }
}
