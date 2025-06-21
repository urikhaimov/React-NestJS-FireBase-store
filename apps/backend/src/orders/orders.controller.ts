import {
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(FirebaseAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get('mine')
  getMyOrders(@Req() req) {
    return this.ordersService.getOrdersByUserId(req.user.uid);
  }

  @Get()
  // @Roles('admin', 'superadmin') ← Temporarily comment this
  // @UseGuards(RolesGuard)        ← And this
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }


  @UseGuards(RolesGuard)
  @Roles('user', 'admin', 'superadmin')
  @Get(':id')
  getOrderById(@Req() req, @Param('id') id: string) {
    return this.ordersService.getOrderById(req.user.uid, id, req.user.role);
  }
}
