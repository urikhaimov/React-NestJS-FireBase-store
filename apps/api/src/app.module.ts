// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ImageProxyController } from './image-proxy/image-proxy.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    OrdersModule,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [ImageProxyController], // ✅ move controller registration here
})
export class AppModule {}
