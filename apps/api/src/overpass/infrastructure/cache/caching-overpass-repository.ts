import { Inject, Injectable, Logger } from '@nestjs/common';
import { OverpassRepository } from '../../domain/interfaces/overpass-repository.interface';
import { RedisService } from '../../../redis/redis.service';
import { GeoJSON } from 'geojson';
import { Settlement } from '../../../domain/value-objects/settlement.vo';
import { Region } from '../../../domain/value-objects/region.vo';

@Injectable()
export class CachingOverpassRepository implements OverpassRepository {
  private readonly logger = new Logger(CachingOverpassRepository.name);
  private readonly CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;
  private readonly CACHE_PREFIX = 'boundaries';

  constructor(
    @Inject('BASE_OVERPASS_REPOSITORY')
    private readonly overpassRepository: OverpassRepository,
    private readonly redisService: RedisService,
  ) {}

  async fetchSettlementBoundaries(settlement: Settlement, region: Region): Promise<GeoJSON> {
    const cacheKey = this.generateCacheKey('settlement', settlement.name, region.name);
    return this.fetchAndCacheGeoJSON(cacheKey, region.name, () =>
      this.overpassRepository.fetchSettlementBoundaries(settlement, region),
    );
  }

  async fetchRegionBoundaries(region: Region): Promise<GeoJSON> {
    const cacheKey = this.generateCacheKey('region', region.name);
    return this.fetchAndCacheGeoJSON(cacheKey, region.name, () =>
      this.overpassRepository.fetchRegionBoundaries(region),
    );
  }

  private generateCacheKey(type: 'settlement' | 'region', ...names: string[]): string {
    return `${this.CACHE_PREFIX}:${type}:${names.join(':')}`;
  }

  private async fetchAndCacheGeoJSON(
    cacheKey: string,
    logContext: string,
    fetchFn: () => Promise<GeoJSON>,
  ): Promise<GeoJSON> {
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      try {
        const geojson = this.parseGeoJSON(cachedData, logContext);
        if (this.isValidGeoJSON(geojson)) {
          this.logger.log(`Cache hit for ${logContext}`);
          return geojson;
        }
        this.logger.warn(`Invalid cached GeoJSON for ${logContext}, fetching new data`);
      } catch (error: unknown) {
        this.logger.error(
          `Failed to parse cached GeoJSON for ${logContext}: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
        );
      }
    }

    const geojson = await fetchFn();
    await this.cacheGeoJSON(cacheKey, geojson, logContext);
    return geojson;
  }

  private parseGeoJSON(data: string, logContext: string): GeoJSON {
    try {
      return JSON.parse(data) as GeoJSON;
    } catch (error: unknown) {
      throw new Error(
        `Invalid GeoJSON format for ${logContext}: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }

  private isValidGeoJSON(geojson: GeoJSON): boolean {
    return (
      !!geojson &&
      geojson.type === 'FeatureCollection' &&
      Array.isArray(geojson.features) &&
      geojson.features.length > 0
    );
  }

  private async cacheGeoJSON(
    cacheKey: string,
    geojson: GeoJSON,
    logContext: string,
  ): Promise<void> {
    try {
      await this.redisService.set(cacheKey, JSON.stringify(geojson), this.CACHE_TTL_SECONDS);
      this.logger.log(`Cached GeoJSON for ${logContext}`);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to cache GeoJSON for ${logContext}: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
