// src/webhooks/webhooks.module.ts
import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { OrdersModule } from '../orders/orders.module'; // ✅ Import OrdersModule

@Module({
  imports: [OrdersModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
