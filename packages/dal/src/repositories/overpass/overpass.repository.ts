import { IOverpassRepository } from './overpass-repository.inteface';
import { Injectable, Logger } from '@nestjs/common';
import { Settlement } from '../settlement';
import { Region } from '../region';
import { GeoJSON } from 'geojson';
import { AxiosResponse } from 'axios';
import { OverpassResponse } from './overpass-response.interface';
import axios from 'axios';
import osmtogeojson from 'osmtogeojson';

@Injectable()
export class OverpassRepository implements IOverpassRepository {
  private readonly overpassUrl: string;
  private readonly logger = new Logger(OverpassRepository.name);

  constructor() {
    this.overpassUrl = process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
  }

  async fetchSettlementBoundaries(settlement: Settlement, region: Region): Promise<GeoJSON> {
    const escapedSettlementName = settlement.name.replace(/'/g, '?.');
    const escapedRegionName = region.name.replace(/'/g, '?.');

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

    return this.requestToOverpassApi(query, settlement.name);
  }

  async fetchRegionBoundaries(region: Region): Promise<GeoJSON> {
    const escapedRegionName = region.name.replace(/'/g, '?.');

    const query = `
      [out:json][timeout:60];
      relation["admin_level"="4"]["name:uk"="${escapedRegionName}"];
      out geom;
    `;

    return this.requestToOverpassApi(query, region.name);
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
        throw new Error(`No boundaries found for ${locality}`);
      }

      const geojson = osmtogeojson(response.data) as GeoJSON;

      if (
        geojson.type !== 'FeatureCollection' ||
        !Array.isArray(geojson.features) ||
        !geojson.features.length
      ) {
        this.logger.warn(`No valid GeoJSON features for ${locality}`);
        throw new Error(`No valid GeoJSON features for ${locality}`);
      }

      this.logger.log(`Cached boundaries for ${locality}`);

      return geojson;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(`Overpass API error for ${locality}: ${errorMessage}`);
      throw new Error(`Error while fetching boundaries from Overpass API: ${errorMessage}`);
    }
  }
}
