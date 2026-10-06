import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt xử lý lỗi tập trung toàn ứng dụng
  app.useGlobalFilters(new AllExceptionsFilter());

  // Kích hoạt tự động validate DTO toàn ứng dụng
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 SpeakUp API Server is running on port: ${port}`);
}
bootstrap();
