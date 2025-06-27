// src/orders/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(FirebaseAuthGuard) // 🔒 All routes below are protected
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('mine')
  getMyOrders(@Req() req) {
    return this.ordersService.getOrdersByUserId(req.user.uid);
  }

  @Get()
  @Roles('admin', 'superadmin')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('user', 'admin', 'superadmin')
  getOrderById(@Req() req, @Param('id') id: string) {
    return this.ordersService.getOrderById(req.user.uid, id, req.user.role);
  }

  @Post()
  createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder({
      ...dto,
      userId: req.user.uid,
    });
  }

  @Post('create-payment-intent') // ✅ Add this
  createPaymentIntent(@Body() body: { amount: number }) {
    return this.ordersService.createPaymentIntent(body.amount);
  }
}
