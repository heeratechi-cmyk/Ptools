import { getPublishableKey, type VercelReq, type VercelRes } from './_utils';

export default function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const publishableKey = getPublishableKey();
  const hasSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());

  return res.status(200).json({
    configured: hasSecret && Boolean(publishableKey),
    hasSecretKey: hasSecret,
    hasPublishableKey: Boolean(publishableKey),
    hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
    publishableKey,
  });
}
