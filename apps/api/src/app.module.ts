// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module'; // ✅ Add this
import { ConfigModule } from '@nestjs/config'; // Optional but recommended

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ for using process.env throughout the app
    ProductsModule,
    OrdersModule,
    UsersModule, // ✅ Register it here
  ],
})
export class AppModule {}
