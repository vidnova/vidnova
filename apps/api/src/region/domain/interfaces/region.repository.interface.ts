import { Region } from '../entities/region.entity';

export interface RegionRepository {
  getById(id: string): Promise<Region>;
}
