import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { SPEAKUP_EXCHANGE } from '../../infrastructure/rabbitmq/rabbitmq.module';

export interface WaitlistRecord {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);
  // Mô phỏng lưu trữ database in-memory
  private readonly waitlistDb: WaitlistRecord[] = [];

  constructor(private readonly amqpConnection: AmqpConnection) {}

  /**
   * Đăng ký Waitlist & Bắn event vào RabbitMQ bất đồng bộ
   */
  async register(dto: CreateWaitlistDto) {
    const startTime = Date.now();

    const record: WaitlistRecord = {
      id: `wl-${Date.now()}`,
      email: dto.email,
      fullName: dto.fullName || 'Học viên SpeakUp',
      createdAt: new Date().toISOString(),
    };

    // 1. Lưu vào Database (mất 2ms)
    this.waitlistDb.push(record);
    this.logger.log(`💾 [Database] Đã lưu thông tin đăng ký: ${record.email}`);

    // 2. Bắn sự kiện vào RabbitMQ (Producer)
    const routingKey = 'waitlist.registered';
    const messagePayload = {
      ...record,
      registeredAt: record.createdAt,
      welcomeOffer: 'Tặng trọn bộ Audio Mini-Story Effortless English 7 Days',
    };

    await this.amqpConnection.publish(
      SPEAKUP_EXCHANGE,
      routingKey,
      messagePayload,
    );
    this.logger.log(
      `📤 [Producer -> RabbitMQ] Đã bắn event "${routingKey}" vào Exchange "${SPEAKUP_EXCHANGE}"`,
    );

    const elapsedMs = Date.now() - startTime;

    // 3. Phản hồi HTTP cho Client ngay lập tức (< 20ms)
    return {
      statusCode: 201,
      message: '🎉 Đăng ký thành công! Hệ thống đang xử lý gửi email chào mừng đến bạn.',
      data: record,
      meta: {
        processingTimeMs: elapsedMs,
        asyncProcessing: true,
        messageBroker: 'RabbitMQ',
      },
    };
  }

  /**
   * Lấy danh sách Waitlist đã đăng ký
   */
  async getAll(): Promise<WaitlistRecord[]> {
    return this.waitlistDb;
  }
}
