export interface IsPointInsideSettlement {
  execute(settlementId: string, lon: number, lat: number): Promise<boolean>;
}
