import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonSetsModule } from './modules/lesson-sets/lesson-sets.module';
import { LessonsModule } from './modules/lessons/lessons.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CoursesModule,
    LessonSetsModule,
    LessonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
