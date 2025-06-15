export class Location {
  constructor(
    private readonly _latitude: number,
    private readonly _longitude: number,
  ) {}

  static create(latitude: number, longitude: number): Location {
    return new Location(latitude, longitude);
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  toJSON() {
    return {
      latitude: this._latitude,
      longitude: this._longitude,
    };
  }
}
