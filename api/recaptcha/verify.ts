import { readJsonBody, type VercelReq, type VercelRes } from '../stripe/_utils';

interface GoogleVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secretKey) {
    return res.status(503).json({
      verified: false,
      error: 'reCAPTCHA secret key is not configured on the server.',
      code: 'RECAPTCHA_NOT_CONFIGURED',
    });
  }

  try {
    const body = await readJsonBody(req);
    const token = typeof body.token === 'string' ? body.token.trim() : '';

    if (!token) {
      return res.status(400).json({
        verified: false,
        error: 'Verification required: Please complete the reCAPTCHA check first before using this tool.',
      });
    }

    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    const forwardedFor = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
    if (forwardedFor) {
      params.append('remoteip', forwardedFor);
    }

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = (await verifyRes.json()) as GoogleVerifyResponse;

    if (!data.success) {
      return res.status(400).json({
        verified: false,
        error: 'reCAPTCHA verification failed or expired. Please try completing it again.',
        errorCodes: data['error-codes'] || [],
      });
    }

    return res.status(200).json({
      verified: true,
      hostname: data.hostname || null,
      challengeTs: data.challenge_ts || null,
    });
  } catch (err: any) {
    console.error('[reCAPTCHA] verify error:', err);
    return res.status(500).json({
      verified: false,
      error: 'Unable to verify reCAPTCHA at this moment. Please try again.',
    });
  }
}
