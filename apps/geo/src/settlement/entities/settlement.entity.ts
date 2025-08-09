import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Region } from '../../region/entities/region.entity';

@Entity('settlements')
export class Settlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  nameEn: string;

  @Column()
  type: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
    srid: 4326,
    nullable: true,
  })
  boundary: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  areaKm2: number;

  @Column()
  regionId: number;

  @ManyToOne(() => Region, (region) => region.settlements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'regionId' })
  region: Region;
}
