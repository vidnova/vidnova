import { Region } from '../../../region/domain/entities/region.entity';

export class Settlement {
  constructor(
    private readonly id: string,
    private name: string,
    private readonly regionId: string,
    private latitude: number,
    private longitude: number,
    private readonly region?: Region,
  ) {}

  getSnapshot() {
    return {
      id: this.id,
      name: this.name,
      regionId: this.regionId,
      latitude: this.latitude,
      longitude: this.longitude,
      region: this.region,
    };
  }

  static create(params: {
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
      params.latitude,
      params.longitude,
      params.region,
    );
  }
}
