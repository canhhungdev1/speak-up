import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEmailConsumer } from './consumers/user-email.consumer';
import { RabbitMQInfrastructureModule } from '../../infrastructure/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQInfrastructureModule],
  controllers: [AuthController],
  providers: [AuthService, UserEmailConsumer],
  exports: [AuthService],
})
export class AuthModule {}
