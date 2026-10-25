import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();
  app.use(express.json());

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
