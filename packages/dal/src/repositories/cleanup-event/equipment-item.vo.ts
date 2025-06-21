export class EquipmentItem {
  constructor(
    private readonly _equipmentId: string,
    private readonly _quantity: number,
  ) {}

  get equipmentId(): string {
    return this._equipmentId;
  }

  get quantity(): number {
    return this._quantity;
  }

  toJSON() {
    return {
      equipmentId: this._equipmentId,
      quantity: this._quantity,
    };
  }
}
