// src/webhooks/webhooks.controller.ts
import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import Stripe from 'stripe';
import { Response, Request } from 'express';
import { getEnv } from '@app/utils/env.util';
import { ELoggerTypes, logger } from '@app/utils/logger.util';
import { AppError, ECommonErrors } from '@app/utils/errors.util';

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
    const endpointSecret = getEnv('STRIPE_WEBHOOK_SECRET');
    if (!endpointSecret) {
      return res.status(500).send('Missing webhook secret');
    }

    if (!signature) {
      const err = new AppError(ECommonErrors.STRIPE_SIGNATURE_MISSING);
      logger[ELoggerTypes.ERROR](err.message);
      return res.status(400).send(ECommonErrors.STRIPE_SIGNATURE_MISSING);
    }

    try {
      const event: Stripe.Event = this.stripe.webhooks.constructEvent(
        req['rawBody'] as string | Buffer<ArrayBufferLike>,
        signature,
        endpointSecret,
      );

      if (event?.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        logger[ELoggerTypes.INFO](`✅ PaymentIntent was successful: ${paymentIntent.id}`);
      }

      res.status(200).send('OK');
    } catch (err: any) {
      if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
        const err = new AppError(ECommonErrors.STRIPE_SIGNATURE_VERIFICATION_FAILED);
        logger[ELoggerTypes.ERROR](err.message);

        return res.status(400).send(ECommonErrors.STRIPE_SIGNATURE_VERIFICATION_FAILED);
      }
    }
  }
}
