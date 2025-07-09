import { ContaminatedPointStatusEnum } from './contaminated-point-status.enum';
import { Location } from '@ecorally/shared';
import { v4 } from 'uuid';

export class ContaminatedPoint {
  private constructor(
    private readonly _id: string,
    private readonly _imageUrl: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _status: ContaminatedPointStatusEnum,
    private readonly _creatorId: string,
    private readonly _location: Location,
  ) {}
  
  static create(
    name: string,
    imageUrl: string,
    description: string,
    creatorId: string,
    location: Location,
  ): ContaminatedPoint {
    return new ContaminatedPoint(
      v4(),
      imageUrl,
      name,
      description,
      ContaminatedPointStatusEnum.ACTIVE,
      creatorId,
      location,
    );
  }

  static fromPersistence(
    id: string,
    imageUrl: string,
    name: string,
    description: string,
    status: ContaminatedPointStatusEnum,
    creatorId: string,
    location: Location,
  ): ContaminatedPoint {
    return new ContaminatedPoint(id, imageUrl, name, description, status, creatorId, location);
  }

  get id(): string {
    return this._id;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get status(): ContaminatedPointStatusEnum {
    return this._status;
  }

  get creatorId(): string {
    return this._creatorId;
  }

  get location(): Location {
    return this._location;
  }
}
