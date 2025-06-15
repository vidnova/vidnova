import { v4 } from 'uuid';
import { Location } from '../../../domain/value-objects/location.vo';

export class Region {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _location: Location,
  ) {}

  static create(name: string, latitude: number, longitude: number): Region {
    if (!name || name.trim().length === 0) {
      throw new Error('Region name is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return new Region(v4(), name.trim(), new Location(latitude, longitude));
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get location(): Location {
    return this._location;
  }
}
