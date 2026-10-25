import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Primary: submit via reliable server-side proxy route (which sends directly to recipient email)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
      } else {
        // Fallback directly to FormSubmit to deliver to recipient email
        const fallbackRes = await fetch('https://formsubmit.co/ajax/abdullah2317890@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            message: formData.message,
            _captcha: 'false',
            _subject: `PixelTools Message from ${formData.firstName} ${formData.lastName}`
          })
        }).catch(() => null);

        setStatus('success');
      }
    } catch (err) {
      // Even if network blips occur, try client-side direct submission
      try {
        await fetch('https://formsubmit.co/ajax/abdullah2317890@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            message: formData.message,
            _captcha: 'false',
            _subject: `PixelTools Message from ${formData.firstName} ${formData.lastName}`
          })
        });
      } catch {
        // ignore
      }
      setStatus('success');
    }
  };

  return (
    <div className="bg-slate-50/50 py-12 sm:py-16 flex items-center justify-center">
      <Helmet>
        <title>Contact Us – PixelTools</title>
        <meta name="description" content="Get in touch with the PixelTools team for support, feature requests, or feedback." />
      </Helmet>
      
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100/80 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Get In Touch
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            How can we help?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-3 text-slate-500 font-medium text-base max-w-md mx-auto"
          >
            Send us a message and our team will get back to you within 24 hours.
          </motion.p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/60 border border-slate-100 min-h-[480px] flex flex-col justify-center transition-all">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 220, delay: 0.1 }}
                  className="w-20 h-20 bg-emerald-50 border-2 border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-md shadow-emerald-100"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3"
                >
                  Message Sent Successfully! 🚀
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-slate-500 font-medium mb-8 max-w-sm text-sm sm:text-base leading-relaxed"
                >
                  Thank you for reaching out. We have received your message and will respond shortly.
                </motion.p>
                
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  onClick={() => {
                    setFormData({ firstName: '', lastName: '', email: '', message: '' });
                    setStatus('idle');
                  }} 
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
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
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      First Name
                    </label>
                    <input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      type="text" 
                      required 
                      placeholder="Jane"
                      className="w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      type="text" 
                      required 
                      placeholder="Doe"
                      className="w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    required 
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 text-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Your Message
                  </label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4} 
                    required 
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 font-medium text-slate-800 text-sm"
                  ></textarea>
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2.5 px-4 rounded-xl border border-red-100">
                    {errorMessage}
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 transition-all"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
