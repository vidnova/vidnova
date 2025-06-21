import { Location } from '@ecorally/shared';

export class Region {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _location: Location,
  ) {}

  static fromPersistence(id: string, name: string, location: Location): Region {
    return new Region(id, name, location);
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
