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
    private readonly _location?: Location,
  ) {}

  static create(params: {
    name: string;
    imageUrl: string;
    description: string;
    creatorId: string;
    location: Location;
  }): ContaminatedPoint {
    return new ContaminatedPoint(
      v4(),
      params.imageUrl,
      params.name,
      params.description,
      ContaminatedPointStatusEnum.ACTIVE,
      params.creatorId,
      params.location,
    );
  }

  static update(params: {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    status: ContaminatedPointStatusEnum;
    creatorId: string;
    location: Location;
  }): ContaminatedPoint {
    return new ContaminatedPoint(
      params.id,
      params.imageUrl,
      params.name,
      params.description,
      params.status,
      params.creatorId,
      params.location,
    );
  }

  static fromPersistence(params: {
    id: string;
    imageUrl: string;
    name: string;
    description: string;
    status: ContaminatedPointStatusEnum;
    creatorId: string;
    location?: Location;
  }): ContaminatedPoint {
    return new ContaminatedPoint(
      params.id,
      params.imageUrl,
      params.name,
      params.description,
      params.status,
      params.creatorId,
      params.location,
    );
  }

  toPrimitives() {
    return {
      id: this._id,
      imageUrl: this._imageUrl,
      name: this._name,
      description: this._description,
      status: this._status,
      creatorId: this._creatorId,
      location: this._location?.toPrimitives(),
    };
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

  get location(): Location | null | undefined {
    return this._location;
  }
}
