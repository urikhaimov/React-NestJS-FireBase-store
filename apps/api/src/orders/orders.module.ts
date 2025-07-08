import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // ✅ Needed for environment variable access
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // ✅ Exported in case used elsewhere (e.g., AppModule or WebhookModule)
})
export class OrdersModule {}
