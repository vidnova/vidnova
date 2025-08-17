import { IUserRepository, User } from '@vidnova/dal';
import {
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetUserFullInfoCommand } from './get-user-full-info.command';
import { RedisService } from '@vidnova/shared';

export class GetUserFullInfoUseCase {
  private readonly CACHE_TTL = 300;

  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: GetUserFullInfoCommand) {
    try {
      const cacheKey = `contaminated-point:${command.userId}`;
      const cachedPoint = await this.redisService.get(cacheKey);
      if (cachedPoint) {
        return JSON.parse(cachedPoint) as User;
      }

      const user = await this.userRepository.findFullById(command.userId);

      if (!user) {
        throw new NotFoundException(`User with ID ${command.userId} not found`);
      }

      await this.redisService.set(cacheKey, JSON.stringify(user), this.CACHE_TTL);

      return user;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to get user info');
    }
  }
}
