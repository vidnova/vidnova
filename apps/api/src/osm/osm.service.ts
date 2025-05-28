import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import axios, { AxiosResponse } from 'axios';
import * as osmtogeojson from 'osmtogeojson';
import type { GeoJSON } from 'geojson';
import { OverpassResponse } from './interfaces/overpass-response';

@Injectable()
export class OsmService {
  private readonly overpassUrl =
    process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
  private readonly cacheTTL = 30 * 24 * 60 * 60;
  private readonly logger = new Logger(OsmService.name);

  constructor(private readonly redis: RedisService) {}

  async fetchSettlementBoundaries(
    settlement: { id: string; name: string },
    region: { id: string; name: string },
    cacheKey: string,
  ): Promise<GeoJSON> {
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      try {
        const geojson = JSON.parse(cachedData) as GeoJSON;
        if (
          geojson &&
          geojson.type === 'FeatureCollection' &&
          geojson.features?.length > 0
        ) {
          this.logger.log(`Cache hit for boundaries of ${settlement.name}`);
          return geojson;
        }
        this.logger.warn(
          `Invalid cached GeoJSON for ${settlement.name}, fetching new data`,
        );
      } catch (error: unknown) {
        this.logger.warn(
          `Failed to parse cached GeoJSON ${error instanceof Error ? error.message : String(error)} for ${settlement.name}`,
        );
      }
    }

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

    try {
      this.logger.log(
        `Fetching boundaries for ${settlement.name} from Overpass API`,
      );
      const response: AxiosResponse<OverpassResponse> = await axios.post(
        this.overpassUrl,
        new URLSearchParams({ data: query }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      if (!response.data?.elements?.length) {
        this.logger.warn(`No boundaries found for ${settlement.name}`);
        throw new InternalServerErrorException(
          `No boundaries found for ${settlement.name}`,
        );
      }

      const geojson = osmtogeojson(response.data) as GeoJSON;

      if (
        geojson.type !== 'FeatureCollection' ||
        !Array.isArray(geojson.features) ||
        !geojson.features.length
      ) {
        this.logger.warn(`No valid GeoJSON features for ${settlement.name}`);
        throw new InternalServerErrorException(
          `No valid GeoJSON features for ${settlement.name}`,
        );
      }

      await this.redis.set(cacheKey, JSON.stringify(geojson), this.cacheTTL);
      this.logger.log(`Cached boundaries for ${settlement.name}`);

      return geojson;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Overpass API error for ${settlement.name}: ${errorMessage}`,
      );
      throw new InternalServerErrorException(
        `Error while fetching boundaries from Overpass API: ${errorMessage}`,
      );
    }
  }

  async fetchRegionBoundaries(
    region: { id: string; name: string },
    cacheKey: string,
  ): Promise<GeoJSON> {
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      try {
        const geojson = JSON.parse(cachedData) as GeoJSON;
        if (
          geojson &&
          geojson.type === 'FeatureCollection' &&
          geojson.features?.length > 0
        ) {
          this.logger.log(`Cache hit for boundaries of ${region.name}`);
          return geojson;
        }
        this.logger.warn(
          `Invalid cached GeoJSON for ${region.name}, fetching new data`,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to parse cached GeoJSON ${error instanceof Error ? error.message : String(error)} for ${region.name}`,
        );
      }
    }

    const escapedRegionName = region.name.replace(/'/g, '?.');

    const query = `
      [out:json][timeout:60];
      relation["admin_level"="4"]["name:uk"="${escapedRegionName}"];
      out geom;
    `;

    try {
      this.logger.log(
        `Fetching boundaries for ${region.name} from Overpass API`,
      );
      const response: AxiosResponse<OverpassResponse> = await axios.post(
        this.overpassUrl,
        new URLSearchParams({ data: query }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      if (!response.data?.elements?.length) {
        this.logger.warn(`No boundaries found for ${region.name}`);
        throw new InternalServerErrorException(
          `No boundaries found for ${region.name}`,
        );
      }

      const geojson = osmtogeojson(response.data) as GeoJSON;

      if (
        geojson.type !== 'FeatureCollection' ||
        !Array.isArray(geojson.features) ||
        !geojson.features.length
      ) {
        this.logger.warn(`No valid GeoJSON features for ${region.name}`);
        throw new InternalServerErrorException(
          `No valid GeoJSON features for ${region.name}`,
        );
      }

      await this.redis.set(cacheKey, JSON.stringify(geojson), this.cacheTTL);
      this.logger.log(`Cached boundaries for ${region.name}`);

      return geojson;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Overpass API error for ${region.name}: ${errorMessage}`,
      );
      throw new InternalServerErrorException(
        `Error while fetching boundaries from Overpass API: ${errorMessage}`,
      );
    }
  }
}
