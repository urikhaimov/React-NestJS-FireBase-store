import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('orders')
export class OrdersController {
  @UseGuards(FirebaseAuthGuard)
  @Get()
  getMyOrders(@Req() req) {
    const uid = req.user.uid;
    return `Returning orders for user: ${uid}`;
  }
}
