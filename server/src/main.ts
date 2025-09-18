import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true }); // 👈 bật CORS
  await app.listen(3000);
  console.log(`🚀 API running on http://localhost:3000`);
}
bootstrap();
