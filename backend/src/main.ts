import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Bỏ qua lỗi SSL "UNABLE_TO_GET_ISSUER_CERT_LOCALLY" khi gọi API ra bên ngoài từ Node.js trên Windows cục bộ
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Bật CORS để cho phép Frontend (cổng 4202) gọi API
  app.enableCors({
    origin: 'http://localhost:4202',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
