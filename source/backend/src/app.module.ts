import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';

@Module({
  imports: [PrismaModule, AuthModule, CoursesModule, LessonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
