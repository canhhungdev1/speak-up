import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { SPEAKUP_DLX } from '../../../infrastructure/rabbitmq/rabbitmq.module';

export const WAITLIST_DLQ_QUEUE = 'speakup_waitlist_email_dlq';

@Injectable()
export class WaitlistDlqConsumer {
  private readonly logger = new Logger(WaitlistDlqConsumer.name);

  /**
   * Consumer chuyên biệt lắng nghe "Hòm thư chết" (Dead Letter Queue - DLQ)
   * Nơi lưu trữ những bức thư gửi thất bại để kỹ sư kiểm tra hoặc lên lịch retry sau.
   */
  @RabbitSubscribe({
    exchange: SPEAKUP_DLX,
    routingKey: 'dlx.waitlist.email',
    queue: WAITLIST_DLQ_QUEUE,
    queueOptions: {
      durable: true,
    },
  })
  async handleDeadLetterMessage(message: any) {
    this.logger.warn(
      `🚨 [DEAD LETTER QUEUE (DLQ) PHÁT HIỆN LỖI] Bức thư gửi tới "${message.email}" bị từ chối!`,
    );
    this.logger.warn(
      `   ➔ Nội dung thư lỗi được lưu trữ an toàn trong Queue "${WAITLIST_DLQ_QUEUE}" để xem xét và xử lý lại sau.`,
    );
  }
}
