import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe, type Stripe as StripeJs } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  X,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import type { BillingCycle, PlanId } from '../data/plans';

export interface CheckoutSelection {
  planId: Exclude<PlanId, 'free'>;
  billingCycle: BillingCycle;
  title: string;
  amountCents: number;
  customAmountCents?: number;
}

interface StripeConfigStatus {
  configured: boolean;
  hasSecretKey: boolean;
  hasPublishableKey: boolean;
  hasWebhookSecret: boolean;
  publishableKey: string | null;
}

interface StripeCheckoutModalProps {
  selection: CheckoutSelection | null;
  onClose: () => void;
}

const stripePromiseCache = new Map<string, Promise<StripeJs | null>>();

function getCachedStripePromise(publishableKey: string) {
  if (!stripePromiseCache.has(publishableKey)) {
    stripePromiseCache.set(publishableKey, loadStripe(publishableKey));
  }
  return stripePromiseCache.get(publishableKey)!;
}

function CheckoutForm({
  amountCents,
  planTitle,
  customerEmail,
  onSuccessRedirect,
}: {
  amountCents: number;
  planTitle: string;
  customerEmail: string;
  onSuccessRedirect: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMsg(null);

    const returnUrl = `${window.location.origin}/payment/success`;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        ...(customerEmail ? { receipt_email: customerEmail } : {}),
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setErrorMsg(result.error.message || 'Your payment could not be processed. Please verify your card details.');
      setSubmitting(false);
      return;
    }

    if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      onSuccessRedirect(result.paymentIntent.id);
      return;
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Order summary</p>
          <p className="text-sm font-bold text-slate-900 truncate">{planTitle}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-extrabold text-slate-900 tabular-nums">
            ${(amountCents / 100).toFixed(2)}
          </p>
          <p className="text-[11px] font-medium text-slate-500">USD</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing payment...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span className="tabular-nums">Pay ${(amountCents / 100).toFixed(2)}</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Encrypted & processed securely by Stripe</span>
      </div>
    </form>
  );
}

export default function StripeCheckoutModal({ selection, onClose }: StripeCheckoutModalProps) {
  const navigate = useNavigate();
  const [config, setConfig] = React.useState<StripeConfigStatus | null>(null);
  const [loadingConfig, setLoadingConfig] = React.useState(true);
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [creatingIntent, setCreatingIntent] = React.useState(false);
  const [intentError, setIntentError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selection) {
      setClientSecret(null);
      setIntentError(null);
      return;
    }

    let cancelled = false;
    setLoadingConfig(true);
    setClientSecret(null);
    setIntentError(null);

    const envPublishable = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() || null;

    fetch('/api/stripe/config')
      .then((res) => res.json())
      .then((data: StripeConfigStatus) => {
        if (cancelled) return;
        const mergedPublishable = data.publishableKey || envPublishable;
        setConfig({
          ...data,
          publishableKey: mergedPublishable,
          hasPublishableKey: Boolean(mergedPublishable),
          configured: data.hasSecretKey && Boolean(mergedPublishable),
        });
        setLoadingConfig(false);
      })
      .catch(() => {
        if (cancelled) return;
        setConfig({
          configured: false,
          hasSecretKey: false,
          hasPublishableKey: Boolean(envPublishable),
          hasWebhookSecret: false,
          publishableKey: envPublishable,
        });
        setLoadingConfig(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selection]);

  React.useEffect(() => {
    if (!selection || !config?.configured || clientSecret) return;

    let cancelled = false;
    setCreatingIntent(true);
    setIntentError(null);

    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: selection.planId,
        billingCycle: selection.billingCycle,
        customAmountCents: selection.customAmountCents,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Could not initialize Stripe checkout.');
        }
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setClientSecret(data.clientSecret);
        setCreatingIntent(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setIntentError(err.message);
        setCreatingIntent(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selection, config?.configured, clientSecret]);

  if (!selection) return null;

  const stripePromise =
    config?.publishableKey ? getCachedStripePromise(config.publishableKey) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stripe-checkout-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <CreditCard className="w-5 h-5 text-indigo-600 shrink-0" />
            <h2 id="stripe-checkout-title" className="text-base font-bold text-slate-900 truncate">
              Complete Checkout
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {loadingConfig || creatingIntent ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
              <p className="text-sm font-medium text-slate-600">
                Preparing secure Stripe payment form...
              </p>
            </div>
          ) : !config?.configured ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Stripe environment keys required
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    The Stripe gateway code is installed and ready. Add your Stripe API keys to your server environment variables (`.env` or Vercel Project Settings) to enable live or test card payments.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                <p className="text-xs font-bold text-slate-700">Gateway environment checklist</p>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/80">
                  <code className="font-mono text-slate-800">STRIPE_SECRET_KEY</code>
                  <span className={`font-semibold flex items-center gap-1 ${config?.hasSecretKey ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {config?.hasSecretKey ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                      </>
                    ) : (
                      'Missing'
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/80">
                  <code className="font-mono text-slate-800">VITE_STRIPE_PUBLISHABLE_KEY</code>
                  <span className={`font-semibold flex items-center gap-1 ${config?.hasPublishableKey ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {config?.hasPublishableKey ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                      </>
                    ) : (
                      'Missing'
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <code className="font-mono text-slate-800">STRIPE_WEBHOOK_SECRET</code>
                  <span className={`font-semibold flex items-center gap-1 ${config?.hasWebhookSecret ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {config?.hasWebhookSecret ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                      </>
                    ) : (
                      'Optional for local test'
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          ) : intentError ? (
            <div className="space-y-4">
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 text-sm text-red-700"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <div className="space-y-1.5">
                  <p className="font-semibold text-red-900">Unable to initialize checkout</p>
                  <p className="text-xs leading-relaxed">{intentError}</p>
                  {intentError.toLowerCase().includes('payment method') && (
                    <p className="text-xs text-red-800 pt-1">
                      Open your{' '}
                      <a
                        href="https://dashboard.stripe.com/settings/payment_methods"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold"
                      >
                        Stripe Payment Methods Dashboard
                      </a>{' '}
                      and enable <strong>Cards</strong> (USD) for your account, then try again.
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Back to plans
              </button>
            </div>
          ) : clientSecret && stripePromise ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="checkout-receipt-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Receipt email (optional)
                </label>
                <input
                  id="checkout-receipt-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#4f46e5',
                      colorText: '#0f172a',
                      colorDanger: '#dc2626',
                      fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                      borderRadius: '10px',
                    },
                  },
                }}
              >
                <CheckoutForm
                  amountCents={selection.amountCents}
                  planTitle={selection.title}
                  customerEmail={customerEmail.trim()}
                  onSuccessRedirect={(paymentIntentId) => {
                    onClose();
                    navigate(`/payment/success?payment_intent=${encodeURIComponent(paymentIntentId)}`);
                  }}
                />
              </Elements>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
