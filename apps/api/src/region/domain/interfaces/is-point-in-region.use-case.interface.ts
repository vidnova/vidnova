export interface IsPointInRegion {
  execute(regionId: string, lon: number, lat: number): Promise<boolean>;
}
