import { Inject, Injectable } from '@nestjs/common';
import { LocationValidationResult } from '../../value-objects';
import { IIsPointInRegion, IIsPointInsideSettlement } from '../../interfaces';
import { IsPointInRegionCommand, IsPointInSettlementCommand } from '../../commands';

@Injectable()
export class LocationValidationService {
  constructor(
    @Inject('IS_POINT_INSIDE_REGION')
    private readonly isPointInsideRegion: IIsPointInRegion,
    @Inject('IS_POINT_INSIDE_SETTLEMENT')
    private readonly isPointInsideSettlement: IIsPointInsideSettlement,
  ) {}

  async validateLocation(
    regionId: string,
    settlementId: string | undefined,
    lon: number,
    lat: number,
  ): Promise<LocationValidationResult> {
    const isPointInsideCorrectRegion = await this.isPointInsideRegion.execute(
      IsPointInRegionCommand.create({ regionId, lat, lon }),
    );

    if (!isPointInsideCorrectRegion) {
      return LocationValidationResult.invalid('The selected point is outside the selected region');
    }

    if (settlementId) {
      const isPointInsideCorrectSettlement = await this.isPointInsideSettlement.execute(
        IsPointInSettlementCommand.create({ settlementId, lat, lon }),
      );

      if (!isPointInsideCorrectSettlement) {
        return LocationValidationResult.invalid(
          'The selected point is outside the selected settlement',
        );
      }
    }

    return LocationValidationResult.valid();
  }
}
