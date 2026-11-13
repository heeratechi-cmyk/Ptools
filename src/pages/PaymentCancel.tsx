import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function PaymentCancel() {
  return (
    <div className="bg-slate-50/50 py-16 sm:py-24">
      <SEOHead
        title="Checkout Cancelled | PixelTools"
        description="Your Stripe checkout session was cancelled. No charges were made."
        path="/payment/cancel"
      />

      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
          <div className="flex items-start gap-3">
            <XCircle className="w-7 h-7 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Checkout cancelled</h1>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                No payment was charged. You can choose a plan again anytime or continue using all free tools.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/pricing"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Pricing</span>
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
