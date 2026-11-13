export type BillingCycle = 'monthly' | 'annual';
export type PlanId = 'free' | 'pro' | 'lifetime' | 'support';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  audience: string;
  description: string;
  monthlyPriceCents: number;
  annualPriceCents: number;
  oneTimePriceCents?: number;
  billingType: 'free' | 'recurring' | 'one_time';
  highlights: string[];
  limits: {
    fileLimit: string;
    batchSize: string;
    ads: string;
    support: string;
  };
}

export const STRIPE_PLANS: Record<Exclude<PlanId, 'support'>, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Starter',
    audience: 'For everyday quick tasks',
    description: 'Essential PDF, image, text, and developer tools running directly in your browser.',
    monthlyPriceCents: 0,
    annualPriceCents: 0,
    billingType: 'free',
    highlights: [
      'Access to all 22+ browser utilities',
      '100% local client-side privacy',
      'Standard single-file processing',
    ],
    limits: {
      fileLimit: 'Up to 25 MB / file',
      batchSize: '1 file at a time',
      ads: 'Ad-supported',
      support: 'Community & email',
    },
  },
  pro: {
    id: 'pro',
    name: 'PixelTools Pro',
    audience: 'For creators & regular workflows',
    description: 'Distraction-free workspace with larger file handling, batch exports, and commercial rights.',
    monthlyPriceCents: 900,
    annualPriceCents: 7900,
    billingType: 'recurring',
    highlights: [
      'Completely ad-free workspace',
      'Priority multi-file batch processing',
      'Commercial usage license included',
      'Priority support response within 24h',
    ],
    limits: {
      fileLimit: 'Up to 250 MB / file',
      batchSize: 'Up to 50 files / batch',
      ads: 'Zero ads',
      support: 'Priority (24h SLA)',
    },
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime Pass',
    audience: 'For power users & solo studios',
    description: 'Pay once and unlock every Pro capability permanently with zero recurring subscriptions.',
    monthlyPriceCents: 0,
    annualPriceCents: 0,
    oneTimePriceCents: 4900,
    billingType: 'one_time',
    highlights: [
      'Everything in PixelTools Pro forever',
      'Single one-time Stripe payment',
      'All upcoming PDF & developer tools',
      'Priority feature requests',
    ],
    limits: {
      fileLimit: 'Up to 500 MB / file',
      batchSize: 'Unlimited local batches',
      ads: 'Zero ads',
      support: 'Priority (24h SLA)',
    },
  },
};

export const SUPPORT_AMOUNTS_CENTS = [500, 1500, 2500];

export function resolvePlanPriceCents(
  planId: PlanId,
  billingCycle: BillingCycle = 'monthly',
  customAmountCents?: number
): { amountCents: number; description: string; mode: 'payment' | 'subscription' } | null {
  if (planId === 'pro') {
    const amountCents =
      billingCycle === 'annual'
        ? STRIPE_PLANS.pro.annualPriceCents
        : STRIPE_PLANS.pro.monthlyPriceCents;
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
      amountCents: STRIPE_PLANS.lifetime.oneTimePriceCents ?? 4900,
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
