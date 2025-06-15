import { EquipmentItem } from '../../domain/value-objects/equipment-item.vo';
import { CleanupEvent } from '../../domain/entities/cleanup-event.entity';
import { CleanupEventStatus } from '@ecorally/shared';

interface PrismaCleanupEventData {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: CleanupEventStatus;
  imageUrl: string;
  organizerId: string;
  organizer: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    latitude: number;
    longitude: number;
    region: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    };
    settlement: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    };
  };
  dates: Array<{ date: Date }>;
  equipments: Array<{
    equipment: { id: string; name: string };
    quantity: number;
  }>;
  takePart: Array<{
    id: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  createdAt: Date;
}

export class CleanupEventMapper {
  static toDomain(data: PrismaCleanupEventData): CleanupEvent {
    const equipmentItems = data.equipments.map(
      (eq) => new EquipmentItem(eq.equipment.id, eq.quantity),
    );

    const eventDates = data.dates.map((d) => d.date);

    return CleanupEvent.fromPersistence(
      data.id,
      data.name,
      data.description,
      data.startDate,
      data.endDate,
      data.imageUrl,
      data.organizerId,
      data.status,
      equipmentItems,
      data.location.latitude,
      data.location.longitude,
      data.location.region.id,
      data.location.settlement.id,
      eventDates,
      data.createdAt,
    );
  }
}
