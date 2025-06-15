export class LocationValidationResult {
  private constructor(
    private readonly isValid: boolean,
    private readonly errorMessage?: string,
  ) {}

  static valid(): LocationValidationResult {
    return new LocationValidationResult(true);
  }

  static invalid(message: string): LocationValidationResult {
    return new LocationValidationResult(false, message);
  }

  isValidLocation(): boolean {
    return this.isValid;
  }

  getErrorMessage(): string | undefined {
    return this.errorMessage;
  }
}
