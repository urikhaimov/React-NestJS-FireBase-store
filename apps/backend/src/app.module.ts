// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule], // ✅ register the products module
})
export class AppModule {}
