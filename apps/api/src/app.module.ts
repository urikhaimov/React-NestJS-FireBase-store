// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import {OrdersModule} from './orders/orders.module'
@Module({
  imports: [ProductsModule, OrdersModule],
   // ✅ register the products module
})


export class AppModule {}
