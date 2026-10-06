import { Injectable, Logger } from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  SPEAKUP_EXCHANGE,
  SPEAKUP_DLX,
} from '../../../infrastructure/rabbitmq/rabbitmq.module';

export const USER_WELCOME_QUEUE = 'speakup_user_welcome_queue';

export interface UserWelcomeMessage {
  id: string;
  email: string;
  name: string | null;
  registeredAt: string;
}

@Injectable()
export class UserEmailConsumer {
  private readonly logger = new Logger(UserEmailConsumer.name);

  /**
   * Consumer lắng nghe sự kiện 'user.welcome' từ RabbitMQ
   * để gửi email chào mừng người dùng mới tham gia ứng dụng.
   */
  @RabbitSubscribe({
    exchange: SPEAKUP_EXCHANGE,
    routingKey: 'user.welcome',
    queue: USER_WELCOME_QUEUE,
    queueOptions: {
      durable: true,
      deadLetterExchange: SPEAKUP_DLX,
      deadLetterRoutingKey: 'dlx.user.welcome',
    },
  })
  async handleWelcomeEmail(message: UserWelcomeMessage) {
    this.logger.log(
      `📥 [RabbitMQ Consumer] Nhận sự kiện chào mừng cho thành viên mới: ${message.email} (ID: ${message.id})`,
    );

    // Kịch bản kiểm thử lỗi Dead Letter Queue nếu cần:
    if (message.email.endsWith('@error.com')) {
      this.logger.error(
        `❌ [Simulated Error] Gặp sự cố kết nối email với ${message.email}! Chuyển sang DLQ...`,
      );
      return new Nack(false);
    }

    // Giả lập gửi email qua dịch vụ SMTP (Resend/SendGrid/SES) mất 1.2s
    this.logger.log(
      `⏳ [RabbitMQ Worker] Đang đóng gói Email chào mừng + Lộ trình Effortless English 7 Quy Tắc cho: ${message.email}...`,
    );
    await new Promise((resolve) => setTimeout(resolve, 1200));

    this.logger.log(
      `🎉 [RabbitMQ Consumer THÀNH CÔNG] Đã gửi Welcome Email tới "${message.name || 'Học viên'} <${message.email}>"!`,
    );
  }
}
