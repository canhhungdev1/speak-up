import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';

// Entities
import { Profile } from './database/entities/profile.entity';
import { Course } from './database/entities/course.entity';
import { LessonSet } from './database/entities/lesson-set.entity';
import { Lesson } from './database/entities/lesson.entity';
import { Transcript } from './database/entities/transcript.entity';
import { UserProgress } from './database/entities/user-progress.entity';
import { DailyCheckin } from './database/entities/daily-checkin.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép dùng process.env ở khắp mọi nơi
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Profile, Course, LessonSet, Lesson, Transcript, UserProgress, DailyCheckin],
        synchronize: true, // Cực kỳ quan trọng: TypeORM sẽ tự động gen/update bảng
        ssl: {
          rejectUnauthorized: false, // Bắt buộc khi kết nối remote DB như Supabase
        }
      }),
    }),
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
