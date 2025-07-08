import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { getEnv, isProd } from '@backend/utils/env.util';
import { setupSwagger } from '@backend/swagger';
import { ELoggerTypes, logger } from '@backend/utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const appPort = getEnv('APP_PORT', 3000);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  // ✅ Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Enable CORS for frontend dev server
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // ✅ Swagger only in development
  if (!isProd()) {
    setupSwagger(app, {
      serverUrl: `http://localhost:${appPort}/${globalPrefix}`,
    });
    logger[ELoggerTypes.INFO]('📘 Swagger docs enabled');
  }

  await app.listen(appPort);
  logger[ELoggerTypes.INFO](`🚀 Server running at http://localhost:${appPort}/${globalPrefix}`);
}

bootstrap().then(() => {
  logger[ELoggerTypes.INFO]('✅ Unified bootstrap completed successfully');
});
