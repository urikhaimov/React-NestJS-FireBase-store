// src/app.module.ts
import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    OrdersModule,     // ✅ this is crucial
    ProductsModule,
    UsersModule,
  ],
})
export class AppModule {}
