import { Module } from '@nestjs/common';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';
import { WaitlistEmailConsumer } from './consumers/waitlist-email.consumer';
import { WaitlistDlqConsumer } from './consumers/waitlist-dlq.consumer';
import { RabbitMQInfrastructureModule } from '../../infrastructure/rabbitmq/rabbitmq.module';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';

@Module({
  imports: [RabbitMQInfrastructureModule],
  controllers: [WaitlistController],
  providers: [
    WaitlistService,
    WaitlistEmailConsumer,
    WaitlistDlqConsumer,
    RateLimitGuard,
  ],
  exports: [WaitlistService],
})
export class WaitlistModule {}
