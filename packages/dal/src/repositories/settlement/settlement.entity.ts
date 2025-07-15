import { Region } from '../region';

export class Settlement {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _regionId: string,
    private readonly _longitude: number,
    private readonly _latitude: number,
    private readonly _region?: Region,
  ) {}

  static fromPersistence(params: {
    id: string;
    name: string;
    regionId: string;
    latitude: number;
    longitude: number;
    region?: Region;
  }): Settlement {
    return new Settlement(
      params.id,
      params.name,
      params.regionId,
      params.longitude,
      params.latitude,
      params.region,
    );
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

  get region(): Region | undefined {
    return this._region;
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      regionId: this._regionId,
      latitude: this._latitude,
      longitude: this._longitude,
      region: this._region,
    };
  }
}
