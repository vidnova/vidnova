import { GeoJSON } from 'geojson';
import { Region } from 'src/region/domain/entities/region.entity';
import { Settlement } from 'src/settlement/domain/entities/settlement.entity';
import { OverpassRepository } from '../../domain/interfaces/overpass-repository.interface';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { OverpassResponse } from 'src/overpass/domain/interfaces/overpass-response';
import axios from 'axios';
import osmtogeojson from 'osmtogeojson';

@Injectable()
export class OverpassRepositoryImpl implements OverpassRepository {
  private readonly overpassUrl: string;
  private readonly logger = new Logger(OverpassRepositoryImpl.name);

  constructor() {
    this.overpassUrl = process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
  }

  async fetchSettlementBoundaries(settlement: Settlement, region: Region): Promise<GeoJSON> {
    const escapedSettlementName = settlement.getSnapshot.name.replace(/'/g, '?.');
    const escapedRegionName = region.getSnapshot.name.replace(/'/g, '?.');

    const query = `
      [out:json][timeout:60];
      area["name:uk"="Україна"]->.a;
      area["name:uk"="${escapedRegionName}"](area.a)->.region;
      (
        node["place"~"city|town|village"]["name:uk"~"${escapedSettlementName}"](area.region);
        way["place"~"city|town|village"]["name:uk"~"${escapedSettlementName}"](area.region);
        relation["place"~"city|town|village"]["name:uk"~"${escapedSettlementName}"](area.region);
      );
      out geom;
    `;

    return this.requestToOverpassApi(query, settlement.getSnapshot.name);
  }

  async fetchRegionBoundaries(region: Region): Promise<GeoJSON> {
    const escapedRegionName = region.getSnapshot.name.replace(/'/g, '?.');

    const query = `
      [out:json][timeout:60];
      relation["admin_level"="4"]["name:uk"="${escapedRegionName}"];
      out geom;
    `;

    return this.requestToOverpassApi(query, region.getSnapshot.name);
  }

  private async requestToOverpassApi(query: string, locality: string) {
    try {
      this.logger.log(`Fetching boundaries for ${locality} from Overpass API`);
      const response: AxiosResponse<OverpassResponse> = await axios.post(
        this.overpassUrl,
        new URLSearchParams({ data: query }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      if (!response.data?.elements?.length) {
        this.logger.warn(`No boundaries found for ${locality}`);
        throw new InternalServerErrorException(`No boundaries found for ${locality}`);
      }

      const geojson = osmtogeojson(response.data) as GeoJSON;

      if (
        geojson.type !== 'FeatureCollection' ||
        !Array.isArray(geojson.features) ||
        !geojson.features.length
      ) {
        this.logger.warn(`No valid GeoJSON features for ${locality}`);
        throw new InternalServerErrorException(`No valid GeoJSON features for ${locality}`);
      }

      this.logger.log(`Cached boundaries for ${locality}`);

      return geojson;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Overpass API error for ${locality}: ${errorMessage}`);
      throw new InternalServerErrorException(
        `Error while fetching boundaries from Overpass API: ${errorMessage}`,
      );
    }
  }
}
