// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // ✅ This is REQUIRED

  await app.listen(3000);
  console.log(`🚀 Server running at http://localhost:3000/api`);
}
bootstrap();
