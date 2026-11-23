import type { IncomingMessage, ServerResponse } from 'node:http';
import Stripe from 'stripe';

export type BillingCycle = 'monthly' | 'annual';
export type PlanId = 'free' | 'pro' | 'lifetime' | 'support';

export type VercelReq = IncomingMessage & {
  body?: any;
  query?: Record<string, string | string[] | undefined>;
};

export type VercelRes = ServerResponse & {
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
  send: (body: unknown) => void;
};

export function resolvePlanPriceCents(
  planId: PlanId,
  billingCycle: BillingCycle = 'monthly',
  customAmountCents?: number
): { amountCents: number; description: string; mode: 'payment' | 'subscription' } | null {
  if (planId === 'pro') {
    const amountCents = billingCycle === 'annual' ? 7900 : 900;
    return {
      amountCents,
      description:
        billingCycle === 'annual'
          ? 'PixelTools Pro (Annual Plan)'
          : 'PixelTools Pro (Monthly Plan)',
      mode: 'payment',
    };
  }

  if (planId === 'lifetime') {
    return {
      amountCents: 4900,
      description: 'PixelTools Lifetime Pass (One-Time)',
      mode: 'payment',
    };
  }

  if (planId === 'support') {
    const validAmount =
      typeof customAmountCents === 'number' &&
      Number.isInteger(customAmountCents) &&
      customAmountCents >= 100 &&
      customAmountCents <= 50000
        ? customAmountCents
        : 500;
    return {
      amountCents: validAmount,
      description: `PixelTools Supporter Contribution ($${(validAmount / 100).toFixed(2)})`,
      mode: 'payment',
    };
  }

  return null;
}

export function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

export function getLegacyStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia' as unknown as Stripe.LatestApiVersion,
  });
}

export function getPublishableKey(): string | null {
  return (
    process.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.STRIPE_PUBLISHABLE_KEY?.trim() ||
    null
  );
}

export async function readJsonBody(req: VercelReq): Promise<Record<string, any>> {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body || '{}');
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export async function readRawBody(req: VercelReq): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body, 'utf8');
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
