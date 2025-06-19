import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('orders')
@UseGuards(FirebaseAuthGuard) // 🔐 Protects all routes in this controller
export class OrdersController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get()
  async getUserOrders(@Req() req: any) {
    const uid = req.user?.uid;
    if (!uid) throw new UnauthorizedException('Missing user ID');

    const snapshot = await this.firebaseService.firestore
      .collection('orders')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
