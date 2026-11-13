import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, FileCheck } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface VerifiedPayment {
  verified: boolean;
  status: string;
  id: string;
  amount: number;
  currency: string;
  planId: string | null;
  planName: string;
  billingCycle: string | null;
  customerEmail: string | null;
  created: number;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [payment, setPayment] = React.useState<VerifiedPayment | null>(null);

  React.useEffect(() => {
    if (!paymentIntentId && !sessionId) {
      setError('No payment reference was found in the URL.');
      setLoading(false);
      return;
    }

    const query = paymentIntentId
      ? `payment_intent=${encodeURIComponent(paymentIntentId)}`
      : `session_id=${encodeURIComponent(sessionId!)}`;

    fetch(`/api/stripe/verify-payment?${query}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Could not verify payment.');
        }
        return data as VerifiedPayment;
      })
      .then((data) => {
        setPayment(data);
        setLoading(false);
        if (data.verified && (data.planId === 'pro' || data.planId === 'lifetime')) {
          try {
            localStorage.setItem(
              'pixeltools_pro_license',
              JSON.stringify({
                active: true,
                planId: data.planId,
                paymentId: data.id,
                activatedAt: new Date().toISOString(),
              })
            );
          } catch {
            // ignore storage errors
          }
        }
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [paymentIntentId, sessionId]);

  return (
    <div className="bg-slate-50/50 py-16 sm:py-24">
      <SEOHead
        title="Payment Confirmation | PixelTools"
        description="Verify your Stripe payment receipt and license activation on PixelTools."
        path="/payment/success"
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          {loading ? (
            <div className="py-10 flex flex-col items-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <h1 className="text-lg font-bold text-slate-900">Verifying payment with Stripe</h1>
              <p className="text-sm text-slate-600">
                Confirming your transaction status securely...
              </p>
            </div>
          ) : error || !payment ? (
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Unable to verify payment
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    {error || 'We could not confirm this transaction.'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/pricing"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  Return to Pricing
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                {payment.verified ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {payment.verified ? 'Payment confirmed' : 'Payment status updated'}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    {payment.verified
                      ? 'Thank you. Your Stripe payment succeeded and your account access is ready.'
                      : `Current Stripe status: ${payment.status}`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 divide-y divide-slate-200 text-sm">
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <span className="text-slate-500">Item</span>
                  <span className="font-semibold text-slate-900 text-right">{payment.planName}</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <span className="text-slate-500">Amount paid</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ${((payment.amount || 0) / 100).toFixed(2)} {(payment.currency || 'usd').toUpperCase()}
                  </span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-emerald-700 capitalize">{payment.status}</span>
                </div>
                {payment.customerEmail && (
                  <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <span className="text-slate-500">Receipt email</span>
                    <span className="font-medium text-slate-900">{payment.customerEmail}</span>
                  </div>
                )}
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <span className="text-slate-500">Reference ID</span>
                  <code className="font-mono text-xs text-slate-700 truncate max-w-[230px]">
                    {payment.id}
                  </code>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/pdf-tools"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Open Tools Workspace</span>
                </Link>
                <Link
                  to="/pricing"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Pricing</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
