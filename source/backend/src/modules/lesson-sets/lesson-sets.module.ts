import { Module } from '@nestjs/common';
import { LessonSetsService } from './lesson-sets.service';
import { LessonSetsController } from './lesson-sets.controller';

@Module({
  controllers: [LessonSetsController],
  providers: [LessonSetsService],
})
export class LessonSetsModule {}
