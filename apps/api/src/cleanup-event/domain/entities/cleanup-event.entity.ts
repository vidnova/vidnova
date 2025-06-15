import { EquipmentItem } from '../value-objects/equipment-item.vo';
import { Location } from '../../../domain/value-objects/location.vo';
import { v4 } from 'uuid';
import { CleanupEventStatus } from '@ecorally/shared';

export class CleanupEvent {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _startDate: Date,
    private readonly _endDate: Date,
    private readonly _imageUrl: string,
    private readonly _organizerId: string,
    private readonly _status: CleanupEventStatus,
    private readonly _equipment: EquipmentItem[],
    private readonly _location: Location,
    private readonly _regionId: string,
    private readonly _settlementId: string | null,
    private readonly _dates: Date[],
    private readonly _createdAt: Date,
  ) {}

  static create(
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    imageUrl: string,
    organizerId: string,
    equipment: EquipmentItem[],
    latitude: number,
    longitude: number,
    regionId: string,
    settlementId: string | null,
    dates: Date[],
  ): CleanupEvent {
    if (!name || name.trim().length === 0) {
      throw new Error('Event name is required');
    }
    if (!description || description.trim().length === 0) {
      throw new Error('Event description is required');
    }
    if (!imageUrl || !this.isValidUrl(imageUrl)) {
      throw new Error('Valid image URL is required');
    }
    if (!organizerId) {
      throw new Error('Organizer ID is required');
    }
    if (!equipment || equipment.length === 0) {
      throw new Error('At least one equipment item is required');
    }
    if (!regionId) {
      throw new Error('Region ID is required');
    }
    if (!dates || dates.length === 0) {
      throw new Error('At least one event date is required');
    }
    if (dates.some((date) => date < startDate || date > endDate)) {
      throw new Error('All event dates must be within start and end date range');
    }

    const location = new Location(latitude, longitude);

    return new CleanupEvent(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      v4(),
      name,
      description,
      startDate,
      endDate,
      imageUrl,
      organizerId,
      'SCHEDULED',
      [...equipment],
      location,
      regionId,
      settlementId,
      [...dates],
      new Date(),
    );
  }

  static update(
    id: string,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    imageUrl: string,
    organizerId: string,
    equipment: EquipmentItem[],
    latitude: number,
    longitude: number,
    regionId: string,
    settlementId: string | null,
    dates: Date[],
    createdAt: Date,
  ): CleanupEvent {
    if (!name || name.trim().length === 0) {
      throw new Error('Event name is required');
    }
    if (!description || description.trim().length === 0) {
      throw new Error('Event description is required');
    }
    if (!imageUrl || !this.isValidUrl(imageUrl)) {
      throw new Error('Valid image URL is required');
    }
    if (!organizerId) {
      throw new Error('Organizer ID is required');
    }
    if (!equipment || equipment.length === 0) {
      throw new Error('At least one equipment item is required');
    }
    if (!regionId) {
      throw new Error('Region ID is required');
    }
    if (!dates || dates.length === 0) {
      throw new Error('At least one event date is required');
    }
    if (dates.some((date) => date < startDate || date > endDate)) {
      throw new Error('All event dates must be within start and end date range');
    }

    const location = new Location(latitude, longitude);

    return new CleanupEvent(
      id,
      name,
      description,
      startDate,
      endDate,
      imageUrl,
      organizerId,
      'SCHEDULED',
      equipment,
      location,
      regionId,
      settlementId,
      dates,
      createdAt,
    );
  }

  static fromPersistence(
    id: string,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    imageUrl: string,
    organizerId: string,
    status: CleanupEventStatus,
    equipment: EquipmentItem[],
    latitude: number,
    longitude: number,
    regionId: string,
    settlementId: string | null,
    eventDates: Date[],
    createdAt: Date,
  ): CleanupEvent {
    return new CleanupEvent(
      id,
      name,
      description,
      startDate,
      endDate,
      imageUrl,
      organizerId,
      status,
      equipment,
      new Location(latitude, longitude),
      regionId,
      settlementId,
      eventDates,
      createdAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get organizerId(): string {
    return this._organizerId;
  }

  get status(): CleanupEventStatus {
    return this._status;
  }

  get equipment(): EquipmentItem[] {
    return [...this._equipment];
  }

  get location(): Location {
    return this._location;
  }

  get regionId(): string {
    return this._regionId;
  }

  get settlementId(): string | null {
    return this._settlementId;
  }

  get dates(): Date[] {
    return [...this._dates];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      imageUrl: this.imageUrl,
      organizerId: this.organizerId,
      status: this.status,
      equipment: this.equipment,
      location: this.location,
      regionId: this.regionId,
      settlementId: this.settlementId,
      dates: this.dates,
      createdAt: this.createdAt,
    };
  }
}
