import { Inject, Injectable } from '@nestjs/common';
import { LocationValidationResult } from '../../cleanup-event/domain/value-objects/location-validation-result.vo';
import { IsPointInRegion } from '../../region/domain/interfaces/is-point-in-region.use-case.interface';
import { IsPointInsideSettlement } from '../../settlement/domain/interfaces/is-point-in-settlement-use-case.interface';

@Injectable()
export class LocationValidationService {
  constructor(
    @Inject('IS_POINT_INSIDE_REGION')
    private readonly isPointInsideRegion: IsPointInRegion,
    @Inject('IS_POINT_INSIDE_SETTLEMENT')
    private readonly isPointInsideSettlement: IsPointInsideSettlement,
  ) {}

  async validateLocation(
    regionId: string,
    settlementId: string | undefined,
    longitude: number,
    latitude: number,
  ): Promise<LocationValidationResult> {
    const isPointInsideCorrectRegion = await this.isPointInsideRegion.execute(
      regionId,
      longitude,
      latitude,
    );

    if (!isPointInsideCorrectRegion) {
      return LocationValidationResult.invalid('The selected point is outside the selected region');
    }

    if (settlementId) {
      const isPointInsideCorrectSettlement = await this.isPointInsideSettlement.execute(
        settlementId,
        longitude,
        latitude,
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
