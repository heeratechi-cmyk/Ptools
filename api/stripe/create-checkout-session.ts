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

    const proto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0] || 'https';
    const host = (req.headers['x-forwarded-host'] as string)?.split(',')[0] || req.headers.host || 'pixeltools-tau.vercel.app';
    const origin = (req.headers.origin as string) || `${proto}://${host}`;

    const isSubscription = planId === 'pro';
    const trimmedEmail = typeof customerEmail === 'string' ? customerEmail.trim() : '';

    const baseSessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? 'subscription' : 'payment',
      customer_email: trimmedEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: resolved.description,
              description: 'PixelTools Browser Utilities Suite',
            },
            unit_amount: resolved.amountCents,
            ...(isSubscription
              ? {
                  recurring: {
                    interval: billingCycle === 'annual' ? 'year' : 'month',
                  },
                }
              : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId,
        billingCycle,
        planName: resolved.description,
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    };

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(baseSessionParams);
    } catch (autoErr: any) {
      const msg = String(autoErr?.message || '');
      if (
        autoErr?.type === 'StripeInvalidRequestError' &&
        (msg.includes('payment method types') || msg.includes('payment_method_types'))
      ) {
        const legacyStripe = getLegacyStripeClient() || stripe;
        session = await legacyStripe.checkout.sessions.create({
          ...baseSessionParams,
          payment_method_types: ['card'],
        } as unknown as Stripe.Checkout.SessionCreateParams);
      } else {
        throw autoErr;
      }
    }

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('[Stripe] create-checkout-session error:', err);
    return res.status(err?.statusCode || 500).json({
      error: err?.message || 'Unable to start Stripe Checkout session.',
    });
  }
}
