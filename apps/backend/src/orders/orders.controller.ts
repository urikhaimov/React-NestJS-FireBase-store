import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

interface RawBodyRequest extends Request {
  rawBody: Buffer;
}

@Controller('orders')
@UseGuards(FirebaseAuthGuard)
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

  @Post('create-payment-intent')
  createPaymentIntent(@Req() req, @Body() body: CreatePaymentIntentDto) {
    return this.ordersService.createPaymentIntent(
      body.amount,
      body.ownerName,
      body.passportId,
      req.user.uid,
      body.cart
    );
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest,
    @Headers('stripe-signature') signature: string
  ) {
    return this.ordersService.handleStripeWebhook(req.rawBody, signature);
  }
}
