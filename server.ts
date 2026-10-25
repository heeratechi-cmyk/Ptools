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
