export class Region {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _longitude: number,
    private readonly _latitude: number,
  ) {}

  static fromPersistence(id: string, name: string, longitude: number, latitude: number): Region {
    return new Region(id, name, longitude, latitude);
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
