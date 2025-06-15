import { Location } from '../../../domain/value-objects/location.vo';
import { v4 } from 'uuid';
import { Region } from '../../../region/domain/entities/region.entity';

export class Settlement {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _regionId: string,
    private readonly _location: Location,
    private readonly _region?: Region,
  ) {}

  static create(name: string, regionId: string, latitude: number, longitude: number): Settlement {
    if (!name || name.trim().length === 0) {
      throw new Error('Settlement name is required');
    }
    if (!regionId) {
      throw new Error('Region ID is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return new Settlement(v4(), name.trim(), regionId, new Location(latitude, longitude));
  }

  static fromPersistence(
    id: string,
    name: string,
    regionId: string,
    latitude: number,
    longitude: number,
  ): Settlement {
    return new Settlement(id, name, regionId, new Location(latitude, longitude));
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get regionId(): string {
    return this._regionId;
  }

  get location(): Location {
    return this._location;
  }
}
