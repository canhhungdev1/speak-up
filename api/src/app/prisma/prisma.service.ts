import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Đã kết nối thành công tới Database qua Prisma');
    } catch (error: any) {
      this.logger.warn(
        `Chưa kết nối PostgreSQL tại localhost:5432 (${error.message}). NestJS Server vẫn tiếp tục khởi chạy.`
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {
      // Ignore disconnect errors on shutdown
    }
  }
}
