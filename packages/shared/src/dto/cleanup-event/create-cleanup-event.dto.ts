export interface ICreateCleanupEventDto {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  imageUrl: string;
  equipments: EquipmentItemDto[];
  latitude: number;
  longitude: number;
  regionId: string;
  settlementId?: string;
  dates: Date[];
}

export interface EquipmentItemDto {
  equipmentId: string;
  quantity: number;
}
