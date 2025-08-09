import { GeoJSONFeature } from './geo-json-feature.interface';

export interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
