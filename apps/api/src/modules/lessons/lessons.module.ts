import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, RateLimitGuard],
  exports: [LessonsService],
})
export class LessonsModule {}
