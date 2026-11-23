import type { IncomingMessage, ServerResponse } from 'node:http';

type VercelReq = IncomingMessage;
type VercelRes = ServerResponse & {
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
};

export default function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const siteKey =
    process.env.VITE_RECAPTCHA_SITE_KEY?.trim() ||
    process.env.RECAPTCHA_SITE_KEY?.trim() ||
    null;

  return res.status(200).json({
    configured: Boolean(siteKey) && Boolean(process.env.RECAPTCHA_SECRET_KEY?.trim()),
    siteKey,
  });
}
