import { Region } from './region.entity';

export interface IRegionRepository {
  getById(id: string): Promise<Region | null>;

  getAll(): Promise<Region[]>;
}
