import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import { resolvePlanPriceCents, type BillingCycle, type PlanId } from './src/data/plans';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

function getLegacyStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia' as unknown as Stripe.LatestApiVersion,
  });
}

function getPublishableKey(): string | null {
  return (
    process.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.STRIPE_PUBLISHABLE_KEY?.trim() ||
    null
  );
}

async function recordStripeTransaction(entry: Record<string, unknown>) {
  try {
    const fs = await import('fs');
    const logsDir = path.join(__dirname, 'data');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFile = path.join(logsDir, 'stripe_orders.json');
    let orders: any[] = [];
    if (fs.existsSync(logFile)) {
      try {
        orders = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      } catch {
        orders = [];
      }
    }
    orders.unshift({ ...entry, recordedAt: new Date().toISOString() });
    fs.writeFileSync(logFile, JSON.stringify(orders.slice(0, 500), null, 2));
  } catch (err) {
    console.warn('[Stripe] Could not persist order log:', err);
  }
}

async function createServer() {
  const app = express();

  // Stripe Webhook MUST receive raw request body before express.json()
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const stripe = getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured on the server.' });
    }

    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      if (webhookSecret && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        event = JSON.parse(req.body.toString('utf8')) as Stripe.Event;
      }
    } catch (err: any) {
      console.error('[Stripe Webhook] Signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await recordStripeTransaction({
          eventType: event.type,
          paymentIntentId: pi.id,
          amount: pi.amount,
          currency: pi.currency,
          email: pi.receipt_email || pi.metadata?.customerEmail || null,
          planId: pi.metadata?.planId || null,
          billingCycle: pi.metadata?.billingCycle || null,
          status: pi.status,
        });
        break;
      }
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await recordStripeTransaction({
          eventType: event.type,
          sessionId: session.id,
          paymentIntentId: session.payment_intent,
          amount: session.amount_total,
          currency: session.currency,
          email: session.customer_details?.email || session.customer_email || null,
          planId: session.metadata?.planId || null,
          billingCycle: session.metadata?.billingCycle || null,
          status: session.payment_status,
        });
        break;
      }
      default:
        break;
    }

    return res.json({ received: true });
  });

  app.use(express.json());

  // Stripe public gateway status & publishable key discovery
  app.get('/api/stripe/config', (_req, res) => {
    const publishableKey = getPublishableKey();
    const hasSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
    return res.json({
      configured: hasSecret && Boolean(publishableKey),
      hasSecretKey: hasSecret,
      hasPublishableKey: Boolean(publishableKey),
      hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
      publishableKey,
    });
  });

  // Create a Stripe PaymentIntent for in-page Payment Element checkout
  app.post('/api/stripe/create-payment-intent', async (req, res) => {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe secret key is not configured yet. Set STRIPE_SECRET_KEY in your environment variables.',
        code: 'STRIPE_NOT_CONFIGURED',
      });
    }

    try {
      const { planId, billingCycle = 'monthly', customerEmail, customAmountCents } = req.body as {
        planId: PlanId;
        billingCycle?: BillingCycle;
        customerEmail?: string;
        customAmountCents?: number;
      };

      const resolved = resolvePlanPriceCents(planId, billingCycle, customAmountCents);
      if (!resolved) {
        return res.status(400).json({ error: 'Selected plan does not require payment or is invalid.' });
      }

      const trimmedEmail = typeof customerEmail === 'string' ? customerEmail.trim() : '';

      const baseIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: resolved.amountCents,
        currency: 'usd',
        description: resolved.description,
        receipt_email: trimmedEmail || undefined,
        metadata: {
          planId,
          billingCycle,
          planName: resolved.description,
          customerEmail: trimmedEmail,
          source: 'pixeltools_web',
        },
      };

      let paymentIntent: Stripe.PaymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.create({
          ...baseIntentParams,
          automatic_payment_methods: { enabled: true },
        });
      } catch (autoErr: any) {
        const msg = String(autoErr?.message || '');
        if (
          autoErr?.type === 'StripeInvalidRequestError' &&
          (msg.includes('payment method types') || msg.includes('payment_method_types'))
        ) {
          const legacyStripe = getLegacyStripeClient() || stripe;
          paymentIntent = await legacyStripe.paymentIntents.create({
            ...baseIntentParams,
            payment_method_types: ['card'],
          } as unknown as Stripe.PaymentIntentCreateParams);
        } else {
          throw autoErr;
        }
      }

      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: resolved.amountCents,
        currency: 'usd',
        planName: resolved.description,
      });
    } catch (err: any) {
      console.error('[Stripe] create-payment-intent error:', err);
      const message = String(err?.message || 'Unable to initialize Stripe payment.');
      const needsPaymentMethodSetup =
        message.includes('payment method types') ||
        message.includes('payment_method_types') ||
        message.includes('payment_methods');
      return res.status(err?.statusCode || 500).json({
        error: message,
        code: needsPaymentMethodSetup ? 'STRIPE_PAYMENT_METHODS_REQUIRED' : undefined,
      });
    }
  });

  // Create a Stripe Hosted Checkout Session (alternative redirect flow)
  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe secret key is not configured yet. Set STRIPE_SECRET_KEY in your environment variables.',
        code: 'STRIPE_NOT_CONFIGURED',
      });
    }

    try {
      const { planId, billingCycle = 'monthly', customerEmail, customAmountCents } = req.body as {
        planId: PlanId;
        billingCycle?: BillingCycle;
        customerEmail?: string;
        customAmountCents?: number;
      };

      const resolved = resolvePlanPriceCents(planId, billingCycle, customAmountCents);
      if (!resolved) {
        return res.status(400).json({ error: 'Selected plan does not require payment or is invalid.' });
      }

      const origin =
        req.headers.origin ||
        `${(req.headers['x-forwarded-proto'] as string)?.split(',')[0] || req.protocol || 'https'}://${req.get('host')}`;

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

      return res.json({ url: session.url, sessionId: session.id });
    } catch (err: any) {
      console.error('[Stripe] create-checkout-session error:', err);
      return res.status(err?.statusCode || 500).json({
        error: err?.message || 'Unable to start Stripe Checkout session.',
      });
    }
  });

  // Verify a completed PaymentIntent or Checkout Session
  app.get('/api/stripe/verify-payment', async (req, res) => {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe secret key is not configured on the server.',
        code: 'STRIPE_NOT_CONFIGURED',
      });
    }

    try {
      const paymentIntentId = req.query.payment_intent as string | undefined;
      const sessionId = req.query.session_id as string | undefined;

      if (paymentIntentId) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        return res.json({
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
        return res.json({
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
  });

  // Contact form submission proxy with multi-channel email delivery
  app.post('/api/contact', async (req, res) => {
    try {
      const { firstName, lastName, email, message } = req.body;
      if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required.' });
      }

      const targetEmail = process.env.CONTACT_EMAIL || 'abdullah2317890@gmail.com';
      const formspreeId = process.env.VITE_FORMSPREE_ID || process.env.FORMSPREE_ID;
      const senderName = `${firstName || ''} ${lastName || ''}`.trim() || 'Website Visitor';

      // 1. Log submission locally so no message is ever lost
      const submission = {
        name: senderName,
        email,
        message,
        timestamp: new Date().toISOString()
      };
      console.log(`[Contact] New submission from ${senderName} (${email}):`, message);

      try {
        const fs = await import('fs');
        const logsDir = path.join(__dirname, 'data');
        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir, { recursive: true });
        }
        const logFile = path.join(logsDir, 'contact_messages.json');
        let currentLogs: any[] = [];
        if (fs.existsSync(logFile)) {
          try {
            currentLogs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
          } catch {
            currentLogs = [];
          }
        }
        currentLogs.unshift(submission);
        fs.writeFileSync(logFile, JSON.stringify(currentLogs.slice(0, 200), null, 2));
      } catch (logErr) {
        console.warn('Could not save submission to disk:', logErr);
      }

      // 2. Deliver email to target inbox via FormSubmit API
      let delivered = false;
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Origin': 'https://pixeltools.app',
            'Referer': 'https://pixeltools.app/contact',
          },
          body: JSON.stringify({
            name: senderName,
            email,
            message,
            _subject: `New PixelTools Message from ${senderName}`,
            _captcha: 'false',
            _template: 'table',
          }),
        });

        const submitData = await formSubmitRes.json().catch(() => ({}));
        console.log(`FormSubmit response status: ${formSubmitRes.status}`, submitData);
        if (formSubmitRes.ok) {
          delivered = true;
        }
      } catch (submitErr) {
        console.error('FormSubmit delivery error:', submitErr);
      }

      // 3. If a valid Formspree form ID is configured, also send to Formspree
      if (formspreeId && formspreeId !== 'mbjndzoy') {
        try {
          const formspreeRes = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: senderName,
              email,
              message,
            }),
          });
          if (formspreeRes.ok) {
            delivered = true;
            console.log(`Forwarded to Formspree (${formspreeId})`);
          }
        } catch (formspreeErr) {
          console.warn('Formspree forwarding warning:', formspreeErr);
        }
      }

      return res.json({ 
        ok: true, 
        message: 'Message sent successfully' 
      });
    } catch (err: any) {
      console.error('Contact endpoint error:', err);
      return res.status(500).json({ error: 'Server error processing contact form' });
    }
  });

  // Trust proxy for accurate protocol & host detection behind cloud proxies / load balancers
  app.set('trust proxy', 1);

  // Common sitemap page definitions
  const sitemapPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/pdf-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/image-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/text-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/developer-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/calculator-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/tools/text-to-pdf', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/image-to-pdf', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/merge-pdf', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/split-pdf', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/compress-pdf', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/pdf-watermark', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/pdf-page-counter', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/image-compressor', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/image-resizer', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/jpg-to-png', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/png-to-jpg', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/webp-converter', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/image-cropper', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/word-counter', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/case-converter', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/json-formatter', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/base64-encoder', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/url-encoder', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/html-formatter', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/css-minifier', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/js-minifier', priority: '0.9', changefreq: 'monthly' },
    { path: '/tools/percentage-calculator', priority: '0.9', changefreq: 'monthly' },
    { path: '/pricing', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.4', changefreq: 'monthly' },
    { path: '/terms', priority: '0.4', changefreq: 'monthly' },
    { path: '/disclaimer', priority: '0.4', changefreq: 'monthly' },
  ];

  function buildSitemapXml(baseUrl: string) {
    const today = new Date().toISOString().split('T')[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map(p => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  }

  function resolveRequestBaseUrl(req: express.Request, forcedDomain?: string) {
    if (forcedDomain) {
      return `https://${forcedDomain}`;
    }
    const forwardedProto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0].trim();
    const rawHost = (req.headers['x-forwarded-host'] as string)?.split(',')[0].trim() || req.get('host') || 'pixeltools-tau.vercel.app';
    const hostWithoutPort = rawHost.split(':')[0];
    const isLocal = hostWithoutPort === 'localhost' || hostWithoutPort === '127.0.0.1';
    
    // Default to pixeltools-tau.vercel.app when testing locally, otherwise use incoming domain
    const effectiveHost = isLocal ? 'pixeltools-tau.vercel.app' : hostWithoutPort;
    // Always default to https for production domains to avoid protocol mismatch in Search Console
    const protocol = forwardedProto || (effectiveHost.includes('vercel.app') || effectiveHost.includes('pixeltools') ? 'https' : req.protocol || 'https');
    return `${protocol}://${effectiveHost}`;
  }

  // Dynamic XML Sitemap Generator (auto-detects exact host/protocol requested by Googlebot or user)
  app.get(['/sitemap.xml', '/sitemap_index.xml'], (req, res) => {
    const baseUrl = resolveRequestBaseUrl(req);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(buildSitemapXml(baseUrl));
  });

  // Explicit non-www / fallback sitemap endpoint
  app.get('/sitemap-non-www.xml', (req, res) => {
    const baseUrl = resolveRequestBaseUrl(req);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(buildSitemapXml(baseUrl));
  });

  // Explicit www / alt sitemap endpoint
  app.get('/sitemap-www.xml', (req, res) => {
    const baseUrl = resolveRequestBaseUrl(req);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(buildSitemapXml(baseUrl));
  });

  // Dynamic robots.txt
  app.get('/robots.txt', (req, res) => {
    const baseUrl = resolveRequestBaseUrl(req);
    const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(robotsTxt);
  });

  // Bing Webmaster verification XML endpoint
  const bingSiteAuthXml = `<?xml version="1.0"?>\n<users>\n\t<user>F76AA711D00C7F03E89F5E480133B068</user>\n</users>`;
  app.get(['/BingSiteAuth.xml', '/bingsiteauth.xml'], (req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(bingSiteAuthXml);
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();
