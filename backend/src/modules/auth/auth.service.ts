import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

interface SyncUserDto {
  auth_provider_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
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
      where: { auth_provider_id: data.auth_provider_id },
      update: {
        email: data.email,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      },
      create: {
        auth_provider_id: data.auth_provider_id,
        email: data.email,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      },
    });

    return {
      message: 'User synchronized successfully',
      user,
    };
  }
}
