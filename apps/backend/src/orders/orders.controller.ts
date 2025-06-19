import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('orders')
export class OrdersController {
  @UseGuards(FirebaseAuthGuard)
  @Get()
@UseGuards(FirebaseAuthGuard)
getMyOrders(@Req() req) {
  const uid = req.user.uid;

  // Temporary mock — replace with Firestore logic later
  return [
    {
      id: '1',
      status: 'pending',
      amount: 59.99,
      createdAt: new Date(),
      items: [
        { name: 'Baby Blanket', quantity: 1, price: 59.99 },
      ],
    },
  ];
}
}
