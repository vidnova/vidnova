import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertCleanupEventDto } from './infrastructure/dto/upsert-cleanup-event.dto';
import { RedisService } from '../redis/redis.service';
import { Prisma } from '@prisma/client';
import { GetCleanupEventsQueryDto } from './infrastructure/dto/get-cleanup-events-query';
import { SortBy } from './enum/get-cleanup-events-sort-options.enum';
import { SettlementService } from '../settlement/settlement.service';
import { RegionService } from 'src/region/region.service';
import { GetCleanupEventUseCase } from './application/use-cases/get-cleanup-event.use-case';
import { CreateCleanupEventUseCase } from './application/use-cases/create-cleanup-event.use-case';

@Injectable()
export class CleanupEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly settlementService: SettlementService,
    private readonly regionService: RegionService,
    private readonly getCleanupEventUseCase: GetCleanupEventUseCase,
    private readonly createCleanupEventUseCase: CreateCleanupEventUseCase,
  ) {}

  async getCleanupEvent(cleanupEventId: string) {
    return this.getCleanupEventUseCase.execute(cleanupEventId);
  }

  async createCleanupEvent(data: UpsertCleanupEventDto, userId: string) {
    return this.createCleanupEventUseCase.execute(data, userId);
  }

  async updateCleanupEvent(data: UpsertCleanupEventDto, cleanupEventId: string, userId: string) {
    try {
      const cleanupEvent = await this.prisma.cleanupEvent.findUnique({
        where: { id: cleanupEventId },
      });

      if (!cleanupEvent) {
        throw new NotFoundException(`Event with ID ${cleanupEventId} not found.`);
      }

      if (cleanupEvent.organizerId !== userId) {
        throw new ForbiddenException('You have no access to change this event.');
      }

      if (data.startDate && data.endDate && data.startDate > data.endDate) {
        throw new ConflictException('Date must be before of the end date.');
      }

      if (data.dates) {
        const invalidDates = data.dates.filter(
          (dateDto) => dateDto.date < data.startDate || dateDto.date > data.endDate,
        );
        if (invalidDates.length > 0) {
          throw new ConflictException('Dates must be in scope startDate and endDate.');
        }
      }

      let isPointInsideCorrectRegion: boolean = false;
      let isPointInsideCorrectSettlement: boolean = false;

      isPointInsideCorrectRegion = await this.regionService.isPointInRegion(
        data.location.latitude,
        data.location.longitude,
        data.regionId,
      );

      if (!isPointInsideCorrectRegion) {
        throw new ConflictException('The selected point is outside the selected region.');
      }

      if (data.settlementId) {
        isPointInsideCorrectSettlement = await this.settlementService.isPointInSettlement(
          data.location.latitude,
          data.location.longitude,
          data.settlementId,
        );
      }

      if (!isPointInsideCorrectSettlement) {
        throw new ConflictException('The selected point is outside the selected settlement.');
      }

      const updatedEvent = await this.prisma.$transaction(async (tx) => {
        const updatedCleanupEvent = await tx.cleanupEvent.update({
          where: { id: cleanupEventId },
          data: {
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            imageUrl: data.imageUrl,
            organizerId: userId,
          },
          include: {
            location: {
              select: {
                latitude: true,
                longitude: true,
                settlement: {
                  select: {
                    name: true,
                    latitude: true,
                    longitude: true,
                    region: {
                      select: {
                        name: true,
                        latitude: true,
                        longitude: true,
                      },
                    },
                  },
                },
              },
            },
            takePart: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        await tx.cleanupEventLocation.upsert({
          where: { eventId: cleanupEventId },
          update: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            settlementId: data.settlementId,
          },
          create: {
            eventId: cleanupEventId,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            settlementId: data.settlementId,
            regionId: data.regionId,
          },
        });

        await Promise.all([
          tx.cleanupEventDate.deleteMany({
            where: { eventId: cleanupEventId },
          }),
          tx.cleanupEquipment.deleteMany({
            where: { eventId: cleanupEventId },
          }),
        ]);

        await Promise.all([
          data.dates && data.dates.length > 0
            ? tx.cleanupEventDate.createMany({
                data: data.dates.map((dateDto) => ({
                  eventId: cleanupEventId,
                  date: dateDto.date,
                })),
              })
            : Promise.resolve(),
          data.equipments && data.equipments.length > 0
            ? tx.cleanupEquipment.createMany({
                data: data.equipments.map((equipmentDto) => ({
                  eventId: cleanupEventId,
                  ...equipmentDto,
                })),
              })
            : Promise.resolve(),
        ]);

        return updatedCleanupEvent;
      });

      await this.redisService.delete('cleanup-events:*');
      await this.redisService.delete(`cleanup-event:${cleanupEventId}`);

      return updatedEvent;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update cleanup event');
    }
  }

  async deleteCleanupEvent(cleanupEventId: string, userId: string) {
    try {
      const cleanupEvent = await this.prisma.cleanupEvent.findUnique({
        where: { id: cleanupEventId },
      });

      if (!cleanupEvent) {
        throw new NotFoundException(`Cleanup event with ID ${cleanupEventId} not found.`);
      }

      if (cleanupEvent.organizerId !== userId) {
        throw new ForbiddenException('You have no access to change this content.');
      }

      await this.prisma.cleanupEvent.delete({
        where: { id: cleanupEventId },
      });

      return 'Cleanup event was successfully deleted.';
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to delete a cleanup event.');
    }
  }

  async getCleanupEvents(query: GetCleanupEventsQueryDto) {
    try {
      const skip = (query.page - 1) * query.pageSize;
      const whereClause = this.buildGetCleanupEventsWhereClause(query);
      const orderByClause = this.buildGetCleanupEventOrderByClause(query);

      const [cleanupEvents, total] = await Promise.all([
        this.prisma.cleanupEvent.findMany({
          where: whereClause,
          orderBy: orderByClause,
          skip,
          take: query.pageSize,
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            status: true,
            imageUrl: true,
            location: {
              select: {
                settlement: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                region: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            organizer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        this.prisma.cleanupEvent.count({ where: whereClause }),
      ]);

      return { cleanupEvents, total };
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private buildGetCleanupEventsWhereClause(
    filters: GetCleanupEventsQueryDto,
  ): Prisma.CleanupEventWhereInput {
    const where: Prisma.CleanupEventWhereInput = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    if (filters.status) where.status = filters.status;

    if (filters.startDate) where.startDate = { gte: filters.startDate };

    if (filters.endDate) where.endDate = { lte: filters.endDate };

    return where;
  }

  private buildGetCleanupEventOrderByClause(
    filters: GetCleanupEventsQueryDto,
  ): Prisma.CleanupEventOrderByWithRelationInput {
    switch (filters.sortBy) {
      case SortBy.NAME:
        return { name: filters.sortOrder || 'asc' };
      case SortBy.START_DATE:
        return { startDate: filters.sortOrder || 'asc' };
      case SortBy.END_DATE:
        return { endDate: filters.sortOrder || 'asc' };
      default:
        return {};
    }
  }
}
