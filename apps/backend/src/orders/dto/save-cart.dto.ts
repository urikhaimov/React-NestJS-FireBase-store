// src/webhooks/webhooks.controller.ts
import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import Stripe from 'stripe';
import { Response, Request } from 'express';
import { getEnv } from '@backend/utils/env.util';
import { ELoggerTypes, logger } from '@backend/utils/logger.util';
import { AppError, ECommonErrors } from '@backend/utils/errors.util';
import { OrdersService } from '@backend/orders/orders.service';

@Controller('webhooks')
export class WebhooksController {
  private stripe = new Stripe(getEnv('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2025-06-30.basil',
  });

  constructor(private readonly ordersService: OrdersService) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const endpointSecret = getEnv('STRIPE_WEBHOOK_SECRET') as string;

    if (!endpointSecret) {
      return res.status(500).send('Missing webhook secret');
    }

    if (!signature) {
      const err = new AppError(ECommonErrors.STRIPE_SIGNATURE_MISSING);
      logger[ELoggerTypes.ERROR](err.message);
      return res.status(400).send(ECommonErrors.STRIPE_SIGNATURE_MISSING);
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        req['rawBody'] as string | Buffer,
        signature,
        endpointSecret,
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger[ELoggerTypes.INFO](`✅ PaymentIntent succeeded: ${paymentIntent.id}`);

        const { userId, itemsJson, totalAmount } = paymentIntent.metadata ?? {};

        if (userId && itemsJson && totalAmount && paymentIntent.id) {
          const items = JSON.parse(itemsJson);
          await this.ordersService.createOrder({
            userId,
            items,
            totalAmount: Number(totalAmount),
            paymentIntentId: paymentIntent.id,
          });
          logger[ELoggerTypes.INFO](`✅ Order created for user: ${userId}`);
        } else {
          logger[ELoggerTypes.ERROR]('❌ Missing metadata for order creation');
        }
      }

      return res.status(200).send('OK');
    } catch (err: any) {
      if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
        const appErr = new AppError(ECommonErrors.STRIPE_SIGNATURE_VERIFICATION_FAILED);
        logger[ELoggerTypes.ERROR](appErr.message);
        return res.status(400).send(ECommonErrors.STRIPE_SIGNATURE_VERIFICATION_FAILED);
      }

      logger[ELoggerTypes.ERROR](`❌ Webhook error: ${err.message}`);
      return res.status(500).send('Webhook error');
    }
  }
}
