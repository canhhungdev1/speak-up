import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

interface SyncUserDto {
  authProviderId: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async syncUser(data: SyncUserDto) {
    this.logger.log(`Syncing user: ${data.email}`);

    // Dùng lệnh upsert của Prisma: 
    // - Nếu tìm thấy user có email này -> Cập nhật thông tin mới nhất
    // - Nếu chưa có -> Tạo mới user
    const user = await this.prisma.user.upsert({
      where: { authProviderId: data.authProviderId },
      update: {
        email: data.email,
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
      },
      create: {
        authProviderId: data.authProviderId,
        email: data.email,
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
      },
    });

    return {
      message: 'User synchronized successfully',
      user,
    };
  }
}
