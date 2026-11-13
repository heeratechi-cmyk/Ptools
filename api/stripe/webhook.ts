import type Stripe from 'stripe';
import { getStripeClient, readRawBody, type VercelReq, type VercelRes } from './_utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured on the server.' });
  }

  try {
    const rawBody = await readRawBody(req);
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      event = JSON.parse(rawBody.toString('utf8')) as Stripe.Event;
    }

    if (event.type === 'payment_intent.succeeded' || event.type === 'checkout.session.completed') {
      console.log(`[Stripe Webhook] Received verified event: ${event.type} (${event.id})`);
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
