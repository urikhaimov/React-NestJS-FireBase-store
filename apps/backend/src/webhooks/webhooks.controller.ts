import { Controller, Post, Req, Res, Headers, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { getEnv } from '../utils/env.util';

@Controller('webhooks')
export class WebhooksController {
  private stripe: Stripe;

  constructor(
    private readonly ordersService: OrdersService,
  ) {
    this.stripe = new Stripe(getEnv('STRIPE_SECRET_KEY') as string, {
      apiVersion: '2025-06-30.basil',
    });
  }

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = getEnv('STRIPE_WEBHOOK_SECRET') as string;
    if (!webhookSecret) return res.status(500).send('Missing webhook secret');
    if (!signature) return res.status(400).send('Missing stripe-signature header');

    try {
      const event = this.stripe.webhooks.constructEvent(
        req['rawBody'], // must be set by raw body middleware!
        signature,
        webhookSecret,
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const ownerName = paymentIntent.metadata?.ownerName;
        const passportId = paymentIntent.metadata?.passportId;

        console.log('✅ Payment succeeded for:', ownerName, passportId);

        // Optional: Save to Firestore (e.g., as abandoned cart recovery or order match)
        // await this.ordersService.saveSuccessfulPayment(paymentIntent);

        // Or defer order creation to user flow
      }

      return res.status(200).send({ received: true });
    } catch (err) {
      console.error('❌ Stripe webhook error:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
