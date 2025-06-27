// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set API prefix
  app.setGlobalPrefix('api');

  // 🔐 Enable global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strips unknown properties
      forbidNonWhitelisted: true, // throws error on unknown props
      transform: true,       // transforms payloads to DTO instances
    }),
  );

  await app.listen(3000);
  console.log(`🚀 Server running at http://localhost:3000/api`);
}
bootstrap();
