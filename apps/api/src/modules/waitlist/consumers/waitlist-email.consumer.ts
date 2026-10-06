import { Injectable, Logger } from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  SPEAKUP_EXCHANGE,
  SPEAKUP_DLX,
} from '../../../infrastructure/rabbitmq/rabbitmq.module';

export const WAITLIST_EMAIL_QUEUE = 'speakup_waitlist_email_queue';

@Injectable()
export class WaitlistEmailConsumer {
  private readonly logger = new Logger(WaitlistEmailConsumer.name);

  /**
   * Consumer lắng nghe tin nhắn từ queue 'speakup_waitlist_email_queue'
   * và mô phỏng việc gửi email chào mừng bất đồng bộ.
   */
  @RabbitSubscribe({
    exchange: SPEAKUP_EXCHANGE,
    routingKey: 'waitlist.registered',
    queue: WAITLIST_EMAIL_QUEUE,
    queueOptions: {
      durable: true,
      // Cấu hình chuyển sang Dead Letter Exchange (DLX) khi message bị lỗi (Nack)
      deadLetterExchange: SPEAKUP_DLX,
      deadLetterRoutingKey: 'dlx.waitlist.email',
    },
  })
  async handleWaitlistEmail(message: any) {
    this.logger.log(
      `📥 [RabbitMQ Consumer] Đã nhận message từ Queue "${WAITLIST_EMAIL_QUEUE}" cho email: ${message.email}`,
    );

    // Kịch bản thử nghiệm Dead Letter Queue (DLQ):
    // Nếu email có đuôi '@error.com' -> giả lập lỗi sập máy chủ gửi mail!
    if (message.email.endsWith('@error.com')) {
      this.logger.error(
        `❌ [Simulated Error] Máy chủ gửi mail bị lỗi với địa chỉ: ${message.email}! Đang đẩy vào Dead Letter Queue (DLQ)...`,
      );
      // Trả về Nack(false) để RabbitMQ đưa thẳng message sang DLX mà không requeue lại
      return new Nack(false);
    }

    // Mô phỏng thời gian gửi email qua SMTP bên thứ ba (mất 1.5 giây)
    this.logger.log(`⏳ Đang kết nối SMTP gửi email chào mừng và link audio tặng kèm...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.logger.log(
      `✅ [RabbitMQ Consumer HOÀN TẤT] Đã gửi email chào mừng thành công tới "${message.fullName} <${message.email}>"!`,
    );
  }
}
