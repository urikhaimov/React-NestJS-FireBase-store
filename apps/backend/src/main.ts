// apps/backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Stripe webhook must get raw body
  app.use('/webhooks/stripe', bodyParser.raw({ type: 'application/json' }));

  await app.listen(3000);
}
bootstrap();
// import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
