// apps/backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { FirebaseAuthGuard } from './auth/firebase-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global guard (optional)
  // app.useGlobalGuards(new FirebaseAuthGuard());

  await app.listen(3000);
}
bootstrap();
