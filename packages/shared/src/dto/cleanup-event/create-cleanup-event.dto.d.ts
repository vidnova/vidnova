export interface ICreateCleanupEventDto {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    imageUrl: string;
    organizerId: string;
    equipment: EquipmentItemDto[];
    latitude: number;
    longitude: number;
    regionId: string;
    settlementId?: string;
    eventDates: Date[];
}
export interface EquipmentItemDto {
    equipmentId: string;
    quantity: number;
}
//# sourceMappingURL=create-cleanup-event.dto.d.ts.map