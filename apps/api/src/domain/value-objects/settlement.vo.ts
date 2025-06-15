import { Location } from './location.vo';
import { Region } from './region.vo';

export class Settlement {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _regionId: string,
    private readonly _location: Location,
    private readonly _region?: Region,
  ) {}

  static create(
    id: string,
    name: string,
    regionId: string,
    location: Location,
    region?: Region,
  ): Settlement {
    return new Settlement(id, name, regionId, location, region);
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

  get region(): Region {
    return this._region;
  }

  get location(): Location {
    return this._location;
  }
}
