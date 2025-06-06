export class Region {
  constructor(
    private readonly id: string,
    private name: string,
    private latitude: number,
    private longitude: number,
  ) {}

  static create(params: { id: string; name: string; latitude: number; longitude: number }): Region {
    return new Region(params.id, params.name, params.latitude, params.longitude);
  }

  getSnapshot() {
    return {
      id: this.id,
      name: this.name,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
