export class EquipmentItem {
  constructor(
    private readonly _equipmentId: string,
    private readonly _quantity: number,
  ) {
    if (!_equipmentId || _equipmentId.trim().length === 0) {
      throw new Error('Equipment ID is required');
    }
    if (_quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
  }

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
