import { CleanupEvent } from 'src/cleanup-event/domain/entities/cleanup-event.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { CleanupEventRepository } from '../../domain/interfaces/cleanup-event.repository.interface';
import { Injectable } from '@nestjs/common';

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
}
