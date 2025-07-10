import { CleanupEventStatus } from '@ecorally/shared';
import { CleanupEvent } from './cleanup-event.entity';
import { EquipmentItem } from './equipment-item.vo';

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
    } | null;
  } | null;
  dates: { date: Date }[];
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

    if (!data.location) {
      throw new Error('Location is required for CleanupEvent');
    }

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
      data.location.settlement ? data.location.settlement.id : undefined,
      eventDates,
      data.createdAt,
    );
  }
}
