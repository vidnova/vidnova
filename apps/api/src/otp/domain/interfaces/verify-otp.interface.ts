export interface VerifyOtp {
  verifyOtp(userId: string, otp: number): Promise<boolean>;
}
