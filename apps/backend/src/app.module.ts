// src/app.module.ts
import { Module } from '@nestjs/common';
import { OrdersController } from './orders/orders.controller';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [OrdersController],
  providers: [],
})
export class AppModule {}
