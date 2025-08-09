import { DataSource, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { databaseConfig } from '../config/database.config';
import * as fs from 'node:fs';
import { Region } from '../region/entities/region.entity';
import { Settlement } from '../settlement/entities/settlement.entity';
import { GeoJSONCollection } from '../common/interfaces/geo-json-collection.interface';
import { GeoJSONFeature } from '../common/interfaces/geo-json-feature.interface';

export class GeoJsonImporter {
  private dataSource: DataSource;
  private batchSize = 50;
  private logger = new Logger(GeoJsonImporter.name);

  async connect() {
    this.logger.log('Connecting to database...');
    this.dataSource = new DataSource(databaseConfig);
    await this.dataSource.initialize();
  }

  async disconnect() {
    if (this.dataSource) {
      await this.dataSource.destroy();
      this.logger.log('Disconnected from database');
    }
  }

  async importRegions(filePath: string) {
    this.logger.log('Import regions');
    this.logger.log(`File: ${filePath}`);

    try {
      const geoData = this.readGeoJSONFile(filePath);

      const regionRepository = this.dataSource.getRepository(Region);

      this.logger.log('Clearing the regions table...');

      await this.dataSource.query(
        'TRUNCATE TABLE "settlements", "regions" CASCADE',
      );

      for (let i = 0; i < geoData.features.length; i += this.batchSize) {
        const batch = geoData.features.slice(i, i + this.batchSize);
        await this.processBatchRegions(batch, regionRepository);

        if (i + this.batchSize < geoData.features.length) {
          await this.sleep(200);
        }
      }

      const totalRegions = await regionRepository.count();
      this.logger.log(
        `Total number of regions in the database: ${totalRegions}`,
      );
    } catch (error) {
      this.logger.error('Critical error importing regions:', error);
      throw error;
    }
  }

  async importSettlements(filePath: string) {
    this.logger.log('Import settlements');
    this.logger.log(`File: ${filePath}`);

    try {
      const geoData = this.readGeoJSONFile(filePath);

      const settlementRepository = this.dataSource.getRepository(Settlement);
      const regionRepository = this.dataSource.getRepository(Region);

      const regions = await regionRepository.find();

      this.logger.log('Clearing the settlements table...');
      await settlementRepository.clear();

      for (let i = 0; i < geoData.features.length; i += this.batchSize) {
        const batch = geoData.features.slice(i, i + this.batchSize);
        await this.processBatchSettlements(
          batch,
          settlementRepository,
          regionRepository,
          regions,
        );

        if (i + this.batchSize < geoData.features.length) {
          await this.sleep(200);
        }
      }

      const totalSettlements = await settlementRepository.count();
      this.logger.log(
        `Total number of settlements in the database: ${totalSettlements}`,
      );
    } catch (error) {
      this.logger.error('Critical error importing settlements:', error);
      throw error;
    }
  }

  private readGeoJSONFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found ${filePath}`);
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const geoData: GeoJSONCollection = JSON.parse(
      jsonData,
    ) as GeoJSONCollection;

    this.logger.log(`File ${filePath} was read`);

    if (geoData.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON format. Expected FeatureCollection');
    }

    return geoData;
  }

  private async processBatchRegions(
    batch: GeoJSONFeature[],
    repository: Repository<Region>,
  ) {
    for (const feature of batch) {
      try {
        if (this.isValidRegionFeature(feature)) {
          await this.saveRegionFeature(feature, repository);
        }
      } catch (error) {
        this.logger.error(`Failed to process batch regions: ${error}`);
        throw error;
      }
    }
  }

  private async processBatchSettlements(
    batch: GeoJSONFeature[],
    settlementRepository: Repository<Settlement>,
    regionRepository: Repository<Region>,
    regions: Region[],
  ) {
    for (const feature of batch) {
      try {
        if (this.isValidSettlementFeature(feature)) {
          await this.saveSettlementFeature(
            feature,
            regionRepository,
            settlementRepository,
            regions,
          );
        }
      } catch (error) {
        this.logger.error(`Failed to process batch regions: ${error}`);
        throw error;
      }
    }
  }

  private isValidSettlementFeature(feature: GeoJSONFeature): boolean {
    return !!(
      feature.properties?.place &&
      ['village', 'town', 'city'].includes(feature.properties.place) &&
      (feature.properties['name:uk'] || feature.properties.name)
    );
  }

  private async saveRegionFeature(
    feature: GeoJSONFeature,
    repository: Repository<Region>,
  ) {
    const props = feature.properties;

    const name = props['name:uk'] || props.name;
    const nameEn = props['name:en'] || props.name;

    if (!name) {
      throw new Error('Missing region name');
    }

    const coordinates = feature.geometry.coordinates[0];
    let wktCoords = '';

    if (Array.isArray(coordinates)) {
      if (typeof coordinates[0] === 'number') {
        const [x, y] = coordinates as number[];
        wktCoords = `${x} ${y}`;
      } else if (Array.isArray(coordinates[0])) {
        wktCoords = (coordinates as number[][])
          .map((coord) => `${coord[0]} ${coord[1]}`)
          .join(', ');
      }
    }
    const polygonWKT = `POLYGON((${wktCoords}))`;

    await repository.query(
      `
        INSERT INTO regions (name, "nameEn", geometry, "areaKm2")
        VALUES ($1, $2, ST_GeomFromText($3, 4326), ST_Area(ST_GeomFromText($3, 4326)::geography) / 1000000)
      `,
      [name, nameEn, polygonWKT],
    );
  }

  private async saveSettlementFeature(
    feature: GeoJSONFeature,
    regionRepository: Repository<Region>,
    settlementRepository: Repository<Settlement>,
    regions: Region[],
  ) {
    const allowedTypes = ['Point', 'Polygon', 'MultiPolygon'];

    if (!allowedTypes.includes(feature.geometry.type)) {
      this.logger.warn(
        `Skipping feature with unsupported geometry type=${feature.geometry.type} id=${feature.id}`,
      );
      return;
    }

    const props = feature.properties;

    const name = props['name:uk'] || props.name;
    const nameEn = props['name:en'] || props.name;
    const type = this.getSettlementType(props.place);

    if (!name) {
      throw new Error('Missing name of settlement');
    }

    let pointWKT: string;
    let boundaryWKT: string | null = null;

    function closeRing(coords: number[][]) {
      const first = coords[0];
      const last = coords[coords.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coords.push(first);
      }
    }

    switch (feature.geometry.type) {
      case 'Point': {
        const coords = feature.geometry.coordinates as number[];
        pointWKT = `POINT(${coords[0]} ${coords[1]})`;
        break;
      }
    }

    if (feature.geometry.type === 'Point') {
      const coords = feature.geometry.coordinates as number[];
      pointWKT = `POINT(${coords[0]} ${coords[1]})`;
    } else if (feature.geometry.type === 'Polygon') {
      const coords = feature.geometry.coordinates as number[][][];

      coords.forEach((ring) => closeRing(ring));

      const outerRing = coords[0];
      const centerLon =
        outerRing.reduce((sum, coord) => sum + coord[0], 0) / outerRing.length;
      const centerLat =
        outerRing.reduce((sum, coord) => sum + coord[1], 0) / outerRing.length;

      pointWKT = `POINT(${centerLon} ${centerLat})`;

      const wktCoords = coords
        .map((ring) => ring.map((c) => `${c[0]} ${c[1]}`).join(', '))
        .map((ringWkt) => `(${ringWkt})`)
        .join(', ');
      boundaryWKT = `MULTIPOLYGON((${wktCoords}))`;
    } else if (feature.geometry.type === 'MultiPolygon') {
      const polygons = feature.geometry.coordinates as number[][][][];

      polygons.forEach((polygon) => {
        polygon.forEach((ring) => closeRing(ring));
      });

      let allCoords: number[][] = [];
      polygons.forEach((polygon) => {
        polygon.forEach((ring) => {
          allCoords = allCoords.concat(ring);
        });
      });

      const centerLon =
        allCoords.reduce((sum, coord) => sum + coord[0], 0) / allCoords.length;
      const centerLat =
        allCoords.reduce((sum, coord) => sum + coord[1], 0) / allCoords.length;

      pointWKT = `POINT(${centerLon} ${centerLat})`;

      const wktPolygons = polygons
        .map((polygon) =>
          polygon
            .map((ring) => ring.map((c) => `${c[0]} ${c[1]}`).join(', '))
            .map((ringWkt) => `(${ringWkt})`)
            .join(', '),
        )
        .map((p) => `(${p})`)
        .join(', ');
      boundaryWKT = `MULTIPOLYGON(${wktPolygons})`;
    } else {
      throw new Error(`Unsupported geometry type: ${feature.geometry.type}`);
    }

    const region = await this.findRegionForPoint(
      pointWKT,
      regions,
      regionRepository,
    );
    if (!region) {
      throw new Error('No matching region found');
    }

    const boundarySql = boundaryWKT
      ? `ST_GeomFromText('${boundaryWKT}', 4326)`
      : 'NULL';

    await settlementRepository.query(
      `
        INSERT INTO settlements (name, "nameEn", type, "regionId", location, boundary, "areaKm2")
        VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326),
                ${boundarySql},
                CASE
                  WHEN ${boundarySql} IS NOT NULL THEN ST_Area(${boundarySql}::geography) / 1000000
                  ELSE NULL END)
      `,
      [name, nameEn, type, region.id, pointWKT],
    );
  }

  private isValidRegionFeature(feature: GeoJSONFeature): boolean {
    return (
      feature.properties?.admin_level === '4' &&
      feature.properties?.boundary === 'administrative' &&
      feature.geometry?.type === 'Polygon' &&
      (feature.properties?.['name:uk']?.includes('область') ||
        feature.properties?.name?.includes('область') ||
        feature.properties?.['name:uk']?.includes('Республіка') ||
        feature.properties?.['name:uk']?.includes('місто Київ'))
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getSettlementType(place: string): string {
    const types: { [key: string]: string } = {
      city: 'місто',
      town: 'містечко',
      village: 'село',
      hamlet: 'селище',
    };
    return types[place] || 'населений пункт';
  }

  private async findRegionForPoint(
    pointWKT: string,
    regions: Region[],
    repository: Repository<Region>,
  ): Promise<Region | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await repository.query(
      `
        SELECT id
        FROM regions
        WHERE ST_Contains(geometry, ST_GeomFromText($1, 4326)) LIMIT 1
      `,
      [pointWKT],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (result.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return regions.find((r) => r.id === result[0].id) || null;
    }

    return regions.length > 0 ? regions[0] : null;
  }
}
