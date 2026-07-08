import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

// Tạm thời tắt kiểm tra SSL trong môi trường dev để tránh lỗi UNABLE_TO_GET_ISSUER_CERT_LOCALLY
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:4200', // Angular app URL
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
