import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Infrastructure
import { SupabaseModule } from './infrastructure/supabase/supabase.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

// Modules (Features)
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ProgressModule } from './modules/progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép dùng process.env ở khắp mọi nơi
    }),
    SupabaseModule,
    PrismaModule,
    AuthModule,
    CoursesModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
