import { PrismaService } from '../../../prisma/prisma.service';
import { OtpRepository } from '../../domain/interfaces/otp.repository';
import { Otp } from '../../domain/entities/otp.entity';

export class OtpRepositoryImpl implements OtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string): Promise<Otp | null> {
    const otp = await this.prisma.otp.findUnique({ where: { userId } });

    if (!otp) return null;

    return Otp.create(otp);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.otp.delete({ where: { id } });
  }
}
