export class Region {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _longitude: number,
    private readonly _latitude: number,
  ) {}

  static fromPersistence(params: {
    id: string;
    name: string;
    longitude: number;
    latitude: number;
  }): Region {
    return new Region(params.id, params.name, params.longitude, params.latitude);
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      latitude: this._latitude,
      longitude: this._longitude,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get longitude(): number {
    return this._longitude;
  }

  get latitude(): number {
    return this._latitude;
  }
}
