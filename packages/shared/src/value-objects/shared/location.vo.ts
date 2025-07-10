export class Location {
  constructor(
    private readonly _latitude: number,
    private readonly _longitude: number,
    private readonly _regionId: string,
    private readonly _settlementId?: string,
  ) {}

  static create(
    latitude: number,
    longitude: number,
    regionId: string,
    settlementId?: string,
  ): Location {
    return new Location(latitude, longitude, regionId, settlementId);
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  get regionId(): string {
    return this._regionId;
  }

  get settlementId(): string | null | undefined {
    return this._settlementId;
  }

  toPrimitives(): {
    latitude: number;
    longitude: number;
    regionId: string;
    settlementId?: string;
  } {
    return {
      latitude: this._latitude,
      longitude: this._longitude,
      regionId: this._regionId,
      settlementId: this._settlementId,
    };
  }

  toJSON() {
    return {
      latitude: this._latitude,
      longitude: this._longitude,
      regionId: this._regionId,
      settlementId: this._settlementId,
    };
  }
}
