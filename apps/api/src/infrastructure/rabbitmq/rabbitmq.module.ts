import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule as GolevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';

export const SPEAKUP_EXCHANGE = 'speakup.exchange';
export const SPEAKUP_DLX = 'speakup.dlx';

@Module({
  imports: [
    GolevelupRabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>(
          'RABBITMQ_URL',
          'amqp://admin:admin123@localhost:5672',
        );

        return {
          uri,
          connectionInitOptions: { wait: false },
          exchanges: [
            {
              name: SPEAKUP_EXCHANGE,
              type: 'topic',
              options: { durable: true },
            },
            {
              name: SPEAKUP_DLX,
              type: 'topic',
              options: { durable: true },
            },
          ],
        };
      },
    }),
  ],
  exports: [GolevelupRabbitMQModule],
})
export class RabbitMQInfrastructureModule {}
