import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Shield, Users, Award } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>About Us – PixelTools</title>
        <meta name="description" content="Learn more about the mission and technology behind PixelTools." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-wider mb-8">
            Our Story
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Professional tools for <br className="hidden sm:block" />
            <span className="text-indigo-600">modern digital workflows</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
            PixelTools was founded with a simple goal: to provide high-quality, professional online tools that are 100% free and respect user privacy. 
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The PixelTools Philosophy</h2>
            <p className="text-slate-500 font-medium">Built on transparency, security, and performance.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Privacy First', desc: "We don't want your files. All processing happens right in your browser, never hitting our servers.", color: 'bg-indigo-50 text-indigo-600' },
              { icon: Zap, title: 'Instant Speed', desc: "No waiting for uploads. Our client-side tools work as fast as your hardware allows.", color: 'bg-emerald-50 text-emerald-600' },
              { icon: Award, title: 'High Quality', desc: "We use industry-standard libraries to ensure professional-grade output every time.", color: 'bg-amber-50 text-amber-600' },
              { icon: Users, title: 'Open & Free', desc: "No accounts, no subscriptions, no credit cards. Just the tools you need, when you need them.", color: 'bg-rose-50 text-rose-600' }
            ].map((value, i) => (
              <div key={i} className="premium-card p-8 group hover:-translate-y-1">
                <div className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlaceholder id="about-middle" variant="horizontal" className="mb-32" />
      </div>

      {/* Technology Section */}
      <section className="py-32 bg-slate-900 text-white rounded-[3rem] mx-4 sm:mx-8 mb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600 opacity-5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-indigo-300 rounded-full text-[11px] font-bold uppercase tracking-wider mb-8">
              The Engine
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight">Built with modern <br />browser technology</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              We leverage modern web standards like WebAssembly, Canvas API, and advanced JavaScript to bring desktop-class performance to your web browser. 
              By moving the processing from the server to the client, we ensure that your files never leave your device.
            </p>
            <div className="space-y-6">
              {[
                'Zero server-side file storage',
                'End-to-end browser processing',
                'Wasm-powered document engines'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <span className="font-semibold text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 lg:mt-0 grid grid-cols-2 gap-4">
            {[
              { label: 'Active Tools', val: '20+' },
              { label: 'Client Side', val: '100%' },
              { label: 'Stored Files', val: '0' },
              { label: 'Uptime', val: '99.9%' }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="text-4xl font-extrabold mb-2 text-white">{stat.val}</div>
                <div className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
