import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface RecaptchaGateProps {
  toolId: string;
  toolName: string;
  children: React.ReactNode;
}

const FALLBACK_SITE_KEY = '6Lfkui4uAAAAACxQ3g__U8otSFVd31NilXMm5ixn';

export default function RecaptchaGate({
  toolId,
  toolName,
  children,
}: RecaptchaGateProps) {
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);
  const gateRef = React.useRef<HTMLDivElement>(null);

  const [siteKey, setSiteKey] = React.useState<string>(
    import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() || FALLBACK_SITE_KEY
  );
  const [token, setToken] = React.useState<string | null>(null);
  const [verified, setVerified] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch('/api/recaptcha/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.siteKey) {
          setSiteKey(data.siteKey);
        }
      })
      .catch(() => {
        // fallback to env/default site key
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCaptchaChange = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      setError(null);
    }
  };

  const handleCaptchaExpired = () => {
    setToken(null);
    setVerified(false);
    setError('Your reCAPTCHA verification expired. Please confirm again before using this tool.');
  };

  const handleCaptchaErrored = () => {
    setToken(null);
    setError('Could not load Google reCAPTCHA widget. Please check your connection or allowed domain settings and retry.');
  };

  const handleConfirm = async () => {
    if (!token) {
      setError(`Verification required: Please complete the reCAPTCHA check first before using ${toolName}.`);
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const res = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, toolId }),
      });
      const rawText = await res.text();
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (!res.ok || !data?.verified) {
        recaptchaRef.current?.reset();
        setToken(null);
        setError(
          data?.error ||
            `reCAPTCHA verification failed (HTTP ${res.status}). Please complete the check again to confirm.`
        );
        setVerifying(false);
        return;
      }

      setVerified(true);
      setVerifying(false);
    } catch {
      recaptchaRef.current?.reset();
      setToken(null);
      setError('Network error while verifying reCAPTCHA. Please try confirming again.');
      setVerifying(false);
    }
  };

  const handleLockedAreaClick = () => {
    setError(
      `Confirm required: Please complete the reCAPTCHA verification and click "Confirm & Unlock Tool" before using ${toolName}.`
    );
    gateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  if (verified) {
    return (
      <div>
        <div className="px-6 py-3 bg-emerald-50/80 border-b border-emerald-200/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verification confirmed for {toolName}</span>
          </div>
          <span className="text-xs font-medium text-emerald-700 whitespace-nowrap">
            Ready to use
          </span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div>
      {/* Security Verification Header & Controls */}
      <div
        ref={gateRef}
        className="p-6 sm:p-8 bg-slate-50/80 border-b border-slate-200"
      >
        <div className="max-w-xl mx-auto flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
            Confirm reCAPTCHA to use {toolName}
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Every tool requires quick human verification before use. Complete the reCAPTCHA check below and click confirm to unlock the workspace.
          </p>

          <div className="mb-5 flex justify-center overflow-x-auto max-w-full">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onChange={handleCaptchaChange}
              onExpired={handleCaptchaExpired}
              onErrored={handleCaptchaErrored}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="w-full mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left flex items-start gap-2.5 text-sm text-red-700"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-snug">{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={verifying}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shadow-xs"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Confirm & Unlock Tool</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Locked Tool Preview — Clicking raises explicit verification error */}
      <div className="relative">
        <div
          className="pointer-events-none select-none opacity-40 blur-[1px]"
          aria-hidden="true"
        >
          {children}
        </div>
        <button
          type="button"
          onClick={handleLockedAreaClick}
          aria-label={`Unlock ${toolName} by completing reCAPTCHA`}
          className="absolute inset-0 z-10 w-full h-full bg-slate-900/5 hover:bg-slate-900/10 transition-colors flex items-center justify-center p-6 cursor-not-allowed"
        >
          <div className="rounded-xl bg-white/95 border border-slate-200 shadow-sm px-5 py-3 flex items-center gap-2.5 text-sm font-semibold text-slate-800">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Complete reCAPTCHA verification above to unlock {toolName}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
