export interface GeoJSONFeature {
  type: 'Feature';
  id: string;
  properties: { [key: string]: string };
  geometry: {
    type: 'Polygon' | 'Point' | 'MultiPolygon' | 'GeometryCollection';
    coordinates: number[][][][] | number[][][] | number[][] | number[];
  };
}
