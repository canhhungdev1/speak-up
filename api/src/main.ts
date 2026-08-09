import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Kích hoạt CORS cho Web và Mobile Clients
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global Prefix: api/v1
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Global ValidationPipe kiểm tra DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 SpeakUp API Server is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
