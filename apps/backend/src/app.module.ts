// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ImageProxyController } from './image-proxy/image-proxy.controller';
import { StripeController } from './stripe/stripe.controller';
@Module({
  imports: [
    // ✅ Loads environment variables from `.env` and makes ConfigService globally available
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Optional: specify custom path if needed
    }),

    // ✅ Feature modules
    ProductsModule,
    OrdersModule,
    UsersModule,
    CategoriesModule,
  ],

  // ✅ Global controllers (if not scoped to specific modules)
  controllers: [ImageProxyController, StripeController ],
})
export class AppModule {}
