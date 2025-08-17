import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Settlement } from '../settlement';

@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  nameEn: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  geometry: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  areaKm2: number;

  @OneToMany(() => Settlement, (settlement) => settlement.region)
  settlements: Settlement[];
}
