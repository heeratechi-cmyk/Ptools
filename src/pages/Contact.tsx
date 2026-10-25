import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageCircle, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { motion, AnimatePresence } from 'framer-motion';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || 'mbjndzoy'; // Placeholder or actual ID
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'; // Placeholder site key

export default function Contact() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [token, setToken] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage('Please verify that you are a human.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    formData.append('h-captcha-response', token);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage('Network error. Please check your connection.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-white min-h-screen py-24">
      <Helmet>
        <title>Contact Us – PixelTools</title>
        <meta name="description" content="Get in touch with the PixelTools team for support or feedback." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6"
          >
            Get In Touch
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            How can we help?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium"
          >
            Have questions or feedback about our tools? We'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-10">Contact Information</h2>
              <div className="space-y-10">
                {[
                  { icon: Mail, title: 'Email Support', detail: 'support@pixeltools.example', color: 'bg-indigo-50 text-indigo-600' },
                  { icon: MessageCircle, title: 'Live Chat', detail: 'Mon - Fri, 9am - 5pm EST', color: 'bg-emerald-50 text-emerald-600' },
                  { icon: MapPin, title: 'Global Office', detail: 'Digital Nomad Hub, Cloud City', color: 'bg-amber-50 text-amber-600' }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-start gap-6 group"
                  >
                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-500 font-medium">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Support Center</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                Check out our Frequently Asked Questions for quick answers to common issues regarding file processing and privacy.
              </p>
              <button className="text-indigo-600 font-bold text-sm hover:translate-x-1 transition-transform flex items-center gap-2">
                Visit Knowledge Base <span className="text-lg">→</span>
              </button>
            </motion.div>
          </div>

          <div className="premium-card p-10 shadow-2xl shadow-slate-200/50 min-h-[600px] flex flex-col">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-10"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-8"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-slate-900 mb-4"
                  >
                    Message Sent! 🚀
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-500 font-medium mb-10 max-w-sm"
                  >
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </motion.p>
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => {
                      setStatus('idle');
                      setToken(null);
                    }} 
                    className="premium-button-secondary"
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-8 flex-1"
                >
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                      <input 
                        name="first-name"
                        type="text" 
                        required 
                        placeholder="Jane"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                      <input 
                        name="last-name"
                        type="text" 
                        required 
                        placeholder="Doe"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      name="email"
                      type="email" 
                      required 
                      placeholder="jane@example.com"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Your Message</label>
                    <textarea 
                      name="message"
                      rows={4} 
                      required 
                      placeholder="Tell us how we can help..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300 font-medium"
                    ></textarea>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <HCaptcha 
                        sitekey={HCAPTCHA_SITE_KEY} 
                        onVerify={(token) => {
                          setToken(token);
                          setErrorMessage('');
                        }}
                        onExpire={() => setToken(null)}
                        onError={() => {
                          setToken(null);
                          setErrorMessage('hCaptcha verification failed. Please try again.');
                        }}
                      />
                    </div>
                    
                    {errorMessage && (
                      <p className="text-red-500 text-xs font-bold text-center animate-pulse">{errorMessage}</p>
                    )}

                    <button 
                      type="submit" 
                      disabled={status === 'submitting' || !token}
                      className="premium-button-primary w-full py-5 text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
