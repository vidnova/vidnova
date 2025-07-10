import { PrismaService } from '../shared';
import { ICleanupEventRepository } from './cleanup-event-repository.interface';
import { CleanupEvent } from './cleanup-event.entity';
import { CleanupEventQueries } from './cleanup-event.query';
import { CleanupEventMapper } from './cleanup-event.mapper';
import { CleanupEventListDto, CleanupSortBy } from '@ecorally/shared';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ICleanupEventsFilters } from '@ecorally/shared';

@Injectable()
export class CleanupEventRepository implements ICleanupEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<CleanupEvent | null> {
    const cleanupEvent = await this.prisma.cleanupEvent.findUnique({
      where: { id },
      select: CleanupEventQueries.SELECT_FIELDS,
    });

    if (!cleanupEvent) {
      return null;
    }

    return CleanupEventMapper.toDomain(cleanupEvent);
  }

  async create(event: CleanupEvent): Promise<CleanupEvent> {
    const cleanupEvent = await this.prisma.cleanupEvent.create({
      data: {
        id: event.id,
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        status: event.status,
        imageUrl: event.imageUrl,
        organizerId: event.organizerId,
        createdAt: event.createdAt,
        dates: {
          create: event.dates.map((date) => ({
            date,
          })),
        },
        location: {
          create: {
            latitude: event.location.latitude,
            longitude: event.location.longitude,
            regionId: event.regionId,
            settlementId: event.settlementId,
          },
        },
        equipments: {
          create: event.equipment.map((eq) => ({
            equipmentId: eq.equipmentId,
            quantity: eq.quantity,
          })),
        },
      },
      select: CleanupEventQueries.SELECT_FIELDS,
    });

    return CleanupEventMapper.toDomain(cleanupEvent);
  }

  async update(event: CleanupEvent): Promise<CleanupEvent> {
    const cleanupEvent = await this.prisma.$transaction(async (prisma) => {
      return prisma.cleanupEvent.update({
        where: { id: event.id },
        data: {
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          status: event.status,
          imageUrl: event.imageUrl,
          dates: {
            deleteMany: {},
            create: event.dates.map((date) => ({
              date,
            })),
          },
          location: {
            upsert: {
              create: {
                latitude: event.location.latitude,
                longitude: event.location.longitude,
                regionId: event.regionId,
                settlementId: event.settlementId,
              },
              update: {
                latitude: event.location.latitude,
                longitude: event.location.longitude,
                regionId: event.regionId,
                settlementId: event.settlementId,
              },
            },
          },
          equipments: {
            deleteMany: {},
            create: event.equipment.map((eq) => ({
              equipmentId: eq.equipmentId,
              quantity: eq.quantity,
            })),
          },
        },
        select: CleanupEventQueries.SELECT_FIELDS,
      });
    });

    return CleanupEventMapper.toDomain(cleanupEvent);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cleanupEvent.delete({ where: { id } });
  }

  async getAll(
    filters: ICleanupEventsFilters,
  ): Promise<{ cleanupEvents: CleanupEventListDto[]; total: number }> {
    const skip = (filters.page - 1) * filters.pageSize;
    const whereClause = this.buildGetCleanupEventsWhereClause(filters);
    const orderByClause = this.buildGetCleanupEventOrderByClause(filters);

    const [cleanupEvents, total] = await Promise.all([
      this.prisma.cleanupEvent.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip,
        take: filters.pageSize,
        select: CleanupEventQueries.SELECT_PREVIEW_FIELDS,
      }),
      this.prisma.cleanupEvent.count({ where: whereClause }),
    ]);

    const mappedCleanupEvent = cleanupEvents.map(
      (event) =>
        new CleanupEventListDto(
          event.id,
          event.name,
          event.startDate,
          event.endDate,
          event.status,
          event.imageUrl,
          event.location,
          event.organizer,
        ),
    );

    return {
      cleanupEvents: mappedCleanupEvent,
      total,
    };
  }

  private buildGetCleanupEventsWhereClause(filters: any): Prisma.CleanupEventWhereInput {
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
    filters: any,
  ): Prisma.CleanupEventOrderByWithRelationInput {
    switch (filters.sortBy) {
      case CleanupSortBy.NAME:
        return { name: filters.sortOrder || 'asc' };
      case CleanupSortBy.START_DATE:
        return { startDate: filters.sortOrder || 'asc' };
      case CleanupSortBy.END_DATE:
        return { endDate: filters.sortOrder || 'asc' };
      default:
        return {};
    }
  }
}
