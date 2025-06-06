import { CleanupEvent } from '../../domain/entities/cleanup-event.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { CleanupEventRepository } from '../../domain/interfaces/cleanup-event.repository.interface';
import { Injectable } from '@nestjs/common';
import { UpsertCleanupEventDto } from '../../domain/dto/upsert-cleanup-event.dto';

@Injectable()
export class CleanupEventRepositoryImpl implements CleanupEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<CleanupEvent | null> {
    const cleanupEvent = await this.prisma.cleanupEvent.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        status: true,
        imageUrl: true,
        organizerId: true,
        organizer: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            latitude: true,
            longitude: true,
            region: {
              select: {
                id: true,
                latitude: true,
                longitude: true,
                name: true,
              },
            },
            settlement: {
              select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
        dates: {
          select: {
            date: true,
          },
        },
        equipments: {
          select: {
            equipment: { select: { id: true, name: true } },
            quantity: true,
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

    if (!cleanupEvent) {
      return null;
    }

    return CleanupEvent.create(cleanupEvent);
  }

  async create(data: UpsertCleanupEventDto, organizerId: string): Promise<CleanupEvent> {
    const cleanupEvent = await this.prisma.$transaction(async (prisma) => {
      const cleanupEvent = await this.prisma.cleanupEvent.create({
        data: {
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          imageUrl: data.imageUrl,
          organizerId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          status: true,
          imageUrl: true,
          organizerId: true,
          organizer: {
            select: {
              id: true,
              name: true,
            },
          },
          location: {
            select: {
              latitude: true,
              longitude: true,
              region: {
                select: {
                  id: true,
                  latitude: true,
                  longitude: true,
                  name: true,
                },
              },
              settlement: {
                select: {
                  id: true,
                  name: true,
                  latitude: true,
                  longitude: true,
                },
              },
            },
          },
          dates: {
            select: {
              date: true,
            },
          },
          equipments: {
            select: {
              equipment: { select: { id: true, name: true } },
              quantity: true,
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

      await Promise.all([
        prisma.cleanupEventLocation.create({
          data: {
            eventId: cleanupEvent.id,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            settlementId: data.settlementId,
            regionId: data.regionId,
          },
        }),
        prisma.cleanupEventDate.createMany({
          data: data.dates.map((dateDto) => ({
            eventId: cleanupEvent.id,
            date: dateDto.date,
          })),
        }),
        prisma.cleanupEquipment.createMany({
          data: data.equipments.map((equipmentDto) => ({
            eventId: cleanupEvent.id,
            ...equipmentDto,
          })),
        }),
      ]);

      return cleanupEvent;
    });

    return CleanupEvent.create(cleanupEvent);
  }
}
