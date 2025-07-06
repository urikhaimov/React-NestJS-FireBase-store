// src/webhooks/webhooks.controller.ts
import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import Stripe from 'stripe';
import { Response, Request } from 'express';

@Controller('webhooks')
export class WebhooksController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-06-30.basil', // use a valid official version
  });

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      console.error('❌ Missing STRIPE_WEBHOOK_SECRET');
      return res.status(500).send('Missing webhook secret');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'], // make sure raw body is available
        signature,
        endpointSecret,
      );
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`✅ PaymentIntent was successful: ${paymentIntent.id}`);
    }

    res.status(200).send('OK');
  }
}
