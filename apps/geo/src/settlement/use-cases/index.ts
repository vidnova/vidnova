import { FindAllSettlementsUseCase } from './find-all-settlements/find-all-settlements.use-case';
import { GetSettlementGeoJSONUseCase } from './get-settlement-geojson/get-settlement-geojson.use-case';
import { SettlementContainsPointUseCase } from './settlement-contains-point/settlement-contains-point.use-case';

export const USE_CASES = [
  FindAllSettlementsUseCase,
  GetSettlementGeoJSONUseCase,
  SettlementContainsPointUseCase,
];
