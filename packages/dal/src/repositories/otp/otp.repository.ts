import { IOtpRepository } from './otp-repository.interface';
import { PrismaService } from '../shared';
import { Otp } from './otp.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string): Promise<Otp | null> {
    const otp = await this.prisma.otp.findUnique({ where: { userId } });

    if (!otp) return null;

    return Otp.fromPersistence(otp);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.otp.delete({ where: { id } });
  }

  async replaceUserOtp(userId: string, hashedOtp: string): Promise<void> {
    this.prisma.$transaction([
      this.prisma.otp.deleteMany({ where: { userId } }),
      this.prisma.otp.create({
        data: {
          code: hashedOtp,
          userId,
        },
      }),
    ]);
  }
}
