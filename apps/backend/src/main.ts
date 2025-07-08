import * as dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getEnv, isProd } from '@backend/utils/env.util';
import { setupSwagger } from '@backend/swagger';
import { ELoggerTypes, logger } from '@backend/utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const appPort = getEnv('APP_PORT', 3000);
  const swaggerPort = getEnv('SWAGGER_PORT', 3001);

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // 👈 Frontend URL
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  if (!isProd()) {
    setupSwagger(app, {
      serverUrl: `http://localhost:${swaggerPort}/${globalPrefix}`,
    });
  }

  await app.listen(appPort);
  logger[ELoggerTypes.INFO](`🚀 Server running at http://localhost:${appPort}/${globalPrefix}`)
}

bootstrap().then((r) => {
  logger[ELoggerTypes.INFO]('Bootstrap completed successfully');
});
