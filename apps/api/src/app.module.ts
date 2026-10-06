import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './infrastructure/redis/redis.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { WaitlistModule } from './modules/waitlist/waitlist.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    RedisModule,
    LessonsModule,
    WaitlistModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
