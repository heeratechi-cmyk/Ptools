import { getStripeClient, type VercelReq, type VercelRes } from './_utils.js';

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return res.status(503).json({
      error: 'Stripe secret key is not configured on the server.',
      code: 'STRIPE_NOT_CONFIGURED',
    });
  }

  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const paymentIntentId = (req.query?.payment_intent as string) || url.searchParams.get('payment_intent') || undefined;
    const sessionId = (req.query?.session_id as string) || url.searchParams.get('session_id') || undefined;

    if (paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      return res.status(200).json({
        verified: pi.status === 'succeeded',
        status: pi.status,
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        planId: pi.metadata?.planId || null,
        planName: pi.metadata?.planName || pi.description || 'PixelTools Payment',
        billingCycle: pi.metadata?.billingCycle || null,
        customerEmail: pi.receipt_email || pi.metadata?.customerEmail || null,
        created: pi.created,
      });
    }

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const paid = session.payment_status === 'paid' || session.status === 'complete';
      return res.status(200).json({
        verified: paid,
        status: session.payment_status,
        id: session.id,
        amount: session.amount_total,
        currency: session.currency,
        planId: session.metadata?.planId || null,
        planName: session.metadata?.planName || 'PixelTools Payment',
        billingCycle: session.metadata?.billingCycle || null,
        customerEmail: session.customer_details?.email || session.customer_email || null,
        created: session.created,
      });
    }

    return res.status(400).json({ error: 'Missing payment_intent or session_id query parameter.' });
  } catch (err: any) {
    console.error('[Stripe] verify-payment error:', err);
    return res.status(err?.statusCode || 500).json({
      error: err?.message || 'Unable to verify Stripe payment status.',
    });
  }
}
