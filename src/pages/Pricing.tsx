import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { getSEOForPath } from '../data/seoData';
import {
  STRIPE_PLANS,
  SUPPORT_AMOUNTS_CENTS,
  type BillingCycle,
} from '../data/plans';
import StripeCheckoutModal, {
  type CheckoutSelection,
} from '../components/StripeCheckoutModal';

export default function Pricing() {
  const seo = getSEOForPath('/pricing');
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>('annual');
  const [checkoutSelection, setCheckoutSelection] =
    React.useState<CheckoutSelection | null>(null);
  const [selectedSupportCents, setSelectedSupportCents] = React.useState<number>(1500);
  const [hasProLicense, setHasProLicense] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('pixeltools_pro_license');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.active) setHasProLicense(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const proAmountCents =
    billingCycle === 'annual'
      ? STRIPE_PLANS.pro.annualPriceCents
      : STRIPE_PLANS.pro.monthlyPriceCents;

  const openProCheckout = () => {
    setCheckoutSelection({
      planId: 'pro',
      billingCycle,
      title:
        billingCycle === 'annual'
          ? 'PixelTools Pro · Annual'
          : 'PixelTools Pro · Monthly',
      amountCents: proAmountCents,
    });
  };

  const openLifetimeCheckout = () => {
    setCheckoutSelection({
      planId: 'lifetime',
      billingCycle: 'monthly',
      title: 'PixelTools Lifetime Pass',
      amountCents: STRIPE_PLANS.lifetime.oneTimePriceCents ?? 4900,
    });
  };

  const openSupportCheckout = () => {
    setCheckoutSelection({
      planId: 'support',
      billingCycle: 'monthly',
      title: `Supporter Contribution ($${(selectedSupportCents / 100).toFixed(2)})`,
      amountCents: selectedSupportCents,
      customAmountCents: selectedSupportCents,
    });
  };

  return (
    <div className="bg-white py-14 sm:py-20">
      <SEOHead title={seo.title} description={seo.description} path={seo.path} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold text-indigo-600 mb-3">
            Transparent pricing · Powered by Stripe
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 [text-wrap:balance]">
            Simple plans for fast browser workflows
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Every core tool stays free forever. Upgrade when you want an ad-free workspace, larger file limits, and batch exports.
          </p>

          {hasProLicense && (
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
              <Check className="w-4 h-4 shrink-0" />
              <span>Pro license active on this browser</span>
            </div>
          )}

          {/* Billing Cadence Segmented Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual billing (save 27%)
            </button>
          </div>
        </div>

        {/* 3 Tier Cards — Single-Elevation Depth */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Starter */}
          <section className="rounded-2xl border border-slate-200 bg-white p-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">
                {STRIPE_PLANS.free.audience}
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {STRIPE_PLANS.free.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {STRIPE_PLANS.free.description}
              </p>

              <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-200">
                <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                  $0
                </span>
                <span className="text-sm font-medium text-slate-500">/ forever</span>
              </div>

              <ul className="space-y-3 mb-8">
                {STRIPE_PLANS.free.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/pdf-tools"
              className="w-full py-3 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-center whitespace-nowrap"
            >
              Continue Free
            </Link>
          </section>

          {/* Pro */}
          <section className="rounded-2xl border-2 border-indigo-600 bg-white p-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-600 mb-1">
                {STRIPE_PLANS.pro.audience}
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {STRIPE_PLANS.pro.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {STRIPE_PLANS.pro.description}
              </p>

              <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-200">
                <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                  ${(proAmountCents / 100).toFixed(0)}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  {billingCycle === 'annual' ? '/ year' : '/ month'}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {STRIPE_PLANS.pro.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={openProCheckout}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          {/* Lifetime Pass */}
          <section className="rounded-2xl border border-slate-200 bg-white p-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">
                {STRIPE_PLANS.lifetime.audience}
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {STRIPE_PLANS.lifetime.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {STRIPE_PLANS.lifetime.description}
              </p>

              <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-200">
                <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                  $49
                </span>
                <span className="text-sm font-medium text-slate-500">one-time</span>
              </div>

              <ul className="space-y-3 mb-8">
                {STRIPE_PLANS.lifetime.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={openLifetimeCheckout}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Get Lifetime Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        </div>

        {/* Comparison Limits Matrix */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Plan limits & specifications
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="py-3.5 px-5 font-semibold text-slate-700">Capability</th>
                  <th className="py-3.5 px-5 font-semibold text-slate-700">Starter</th>
                  <th className="py-3.5 px-5 font-semibold text-indigo-700">PixelTools Pro</th>
                  <th className="py-3.5 px-5 font-semibold text-slate-900">Lifetime Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-medium text-slate-700">Max file size</td>
                  <td className="py-3.5 px-5 text-slate-600 tabular-nums">{STRIPE_PLANS.free.limits.fileLimit}</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium tabular-nums">{STRIPE_PLANS.pro.limits.fileLimit}</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium tabular-nums">{STRIPE_PLANS.lifetime.limits.fileLimit}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-medium text-slate-700">Batch queue</td>
                  <td className="py-3.5 px-5 text-slate-600 tabular-nums">{STRIPE_PLANS.free.limits.batchSize}</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium tabular-nums">{STRIPE_PLANS.pro.limits.batchSize}</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium tabular-nums">{STRIPE_PLANS.lifetime.limits.batchSize}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-medium text-slate-700">Workspace ads</td>
                  <td className="py-3.5 px-5 text-slate-600">{STRIPE_PLANS.free.limits.ads}</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium">{STRIPE_PLANS.pro.limits.ads}</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium">{STRIPE_PLANS.lifetime.limits.ads}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-medium text-slate-700">Processing location</td>
                  <td className="py-3.5 px-5 text-slate-600">100% browser-local</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium">100% browser-local</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium">100% browser-local</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-medium text-slate-700">Support response</td>
                  <td className="py-3.5 px-5 text-slate-600">{STRIPE_PLANS.free.limits.support}</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium tabular-nums">{STRIPE_PLANS.pro.limits.support}</td>
                  <td className="py-3.5 px-5 text-slate-900 font-medium tabular-nums">{STRIPE_PLANS.lifetime.limits.support}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* One-time Supporter / Quick Stripe Payment */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-7 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-1.5">
              Make a one-time contribution
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Want to support PixelTools development or run a quick one-time Stripe card payment without subscribing? Choose an amount below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200">
              {SUPPORT_AMOUNTS_CENTS.map((cents) => (
                <button
                  key={cents}
                  type="button"
                  onClick={() => setSelectedSupportCents(cents)}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors tabular-nums whitespace-nowrap shrink-0 ${
                    selectedSupportCents === cents
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ${(cents / 100).toFixed(0)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={openSupportCheckout}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span className="tabular-nums">
                Pay ${(selectedSupportCents / 100).toFixed(0)} via Stripe
              </span>
            </button>
          </div>
        </section>

        {/* Security Footnote */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            PCI-DSS Level 1 payments via Stripe
          </span>
          <span aria-hidden="true">·</span>
          <span>Cards, Apple Pay, Google Pay & Link supported</span>
          <span aria-hidden="true">·</span>
          <Link to="/contact" className="text-indigo-600 hover:underline font-medium">
            Billing questions? Contact support
          </Link>
        </div>
      </div>

      <StripeCheckoutModal
        selection={checkoutSelection}
        onClose={() => setCheckoutSelection(null)}
      />
    </div>
  );
}
