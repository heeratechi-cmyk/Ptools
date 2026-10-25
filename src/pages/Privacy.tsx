import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Privacy() {
  return (
    <div className="bg-white min-h-screen py-24">
      <Helmet>
        <title>Privacy Policy – PixelTools</title>
        <meta name="description" content="Learn about how PixelTools protects your privacy and handles your data." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6">
            Data Protection
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">
            We believe privacy is a fundamental human right. PixelTools is built from the ground up to respect your data.
          </p>
        </div>
        
        <AdPlaceholder id="privacy-top" variant="horizontal" className="mb-16" />
        
        <div className="bg-slate-900 rounded-[2.5rem] p-10 mb-20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600 opacity-10 blur-[80px] pointer-events-none" />
          <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
            <Lock className="w-10 h-10" />
          </div>
          <div className="relative">
            <h3 className="text-xl font-bold text-white mb-3">Our Privacy Commitment</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              PixelTools is built on the principle of "Privacy by Design". We do not collect, store, or see your files. All processing happens locally on your device, ensuring your sensitive information never leaves your browser.
            </p>
          </div>
        </div>

        <div className="space-y-20">
          {[
            {
              id: '1',
              title: 'Data Collection',
              content: 'PixelTools does not require user registration or account creation. We do not collect personal information such as names, email addresses, or phone numbers. Our tools are designed to work entirely within your web browser using client-side technologies.'
            },
            {
              id: '2',
              title: 'File Handling',
              content: 'When you upload a file (PDF, image, or text) to PixelTools:',
              list: [
                'The file is NOT uploaded to our servers.',
                'The file remains in your browser\'s memory.',
                'Processing is performed by your own computer\'s CPU/GPU.',
                'Temporary URLs created for downloads are revoked once you close the page or reset the tool.'
              ]
            },
            {
              id: '3',
              title: 'Analytics',
              content: 'We use privacy-preserving, anonymized analytics to understand general traffic patterns. This data is fully anonymized and does not include your files, IP addresses, or any sensitive personal data.'
            },
            {
              id: '4',
              title: 'Cookies',
              content: 'We use minimal cookies strictly for functional purposes, such as remembering your theme preference or recently used tools. We do not use tracking cookies for advertising purposes.'
            }
          ].map((section) => (
            <section key={section.id} className="group">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest">{section.id}</span>
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{section.title}</h2>
              </div>
              <div className="text-slate-500 font-medium leading-relaxed space-y-4">
                <p>{section.content}</p>
                {section.list && (
                  <ul className="grid sm:grid-cols-2 gap-4 mt-6">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[13px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          <section className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Last Updated: October 24, 2026
            </p>
            <div className="flex items-center gap-6">
               <button className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Download PDF Version</button>
               <button className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Archive</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
