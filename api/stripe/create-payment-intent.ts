import type Stripe from 'stripe';
import {
  getLegacyStripeClient,
  getStripeClient,
  readJsonBody,
  resolvePlanPriceCents,
  type BillingCycle,
  type PlanId,
  type VercelReq,
  type VercelRes,
} from './_utils.js';

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return res.status(503).json({
      error: 'Stripe secret key is not configured yet. Set STRIPE_SECRET_KEY in your environment variables.',
      code: 'STRIPE_NOT_CONFIGURED',
    });
  }

  try {
    const body = await readJsonBody(req);
    const {
      planId,
      billingCycle = 'monthly',
      customerEmail,
      customAmountCents,
    } = body as {
      planId: PlanId;
      billingCycle?: BillingCycle;
      customerEmail?: string;
      customAmountCents?: number;
    };

    const resolved = resolvePlanPriceCents(planId, billingCycle, customAmountCents);
    if (!resolved) {
      return res.status(400).json({ error: 'Selected plan does not require payment or is invalid.' });
    }

    const trimmedEmail = typeof customerEmail === 'string' ? customerEmail.trim() : '';

    const baseIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: resolved.amountCents,
      currency: 'usd',
      description: resolved.description,
      receipt_email: trimmedEmail || undefined,
      metadata: {
        planId,
        billingCycle,
        planName: resolved.description,
        customerEmail: trimmedEmail,
        source: 'pixeltools_web',
      },
    };

    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        ...baseIntentParams,
        automatic_payment_methods: { enabled: true },
      });
    } catch (autoErr: any) {
      const msg = String(autoErr?.message || '');
      if (
        autoErr?.type === 'StripeInvalidRequestError' &&
        (msg.includes('payment method types') || msg.includes('payment_method_types'))
      ) {
        const legacyStripe = getLegacyStripeClient() || stripe;
        paymentIntent = await legacyStripe.paymentIntents.create({
          ...baseIntentParams,
          payment_method_types: ['card'],
        } as unknown as Stripe.PaymentIntentCreateParams);
      } else {
        throw autoErr;
      }
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: resolved.amountCents,
      currency: 'usd',
      planName: resolved.description,
    });
  } catch (err: any) {
    console.error('[Stripe] create-payment-intent error:', err);
    const message = String(err?.message || 'Unable to initialize Stripe payment.');
    const needsPaymentMethodSetup =
      message.includes('payment method types') ||
      message.includes('payment_method_types') ||
      message.includes('payment_methods');
    return res.status(err?.statusCode || 500).json({
      error: message,
      code: needsPaymentMethodSetup ? 'STRIPE_PAYMENT_METHODS_REQUIRED' : undefined,
    });
  }
}
