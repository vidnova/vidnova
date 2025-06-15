import { Region } from '../../../domain/value-objects/region.vo';

export interface RegionRepository {
  getById(id: string): Promise<Region>;
}
