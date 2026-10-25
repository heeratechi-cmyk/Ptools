import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <Helmet>
        <title>Disclaimer – PixelTools</title>
        <meta name="description" content="Legal disclaimer for PixelTools." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6">
            Important Information
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Disclaimer</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">
            Please read this disclaimer carefully before using any of the tools provided on PixelTools.
          </p>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-10 mb-20 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-amber-600 shrink-0 shadow-sm border border-amber-100">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-3">General Information Only</h3>
            <p className="text-amber-800/80 leading-relaxed font-medium">
              The tools and information provided by PixelTools are for general informational and utility purposes only. We aim to provide accurate and reliable tools, but results should always be verified for critical applications.
            </p>
          </div>
        </div>

        <div className="space-y-20">
          {[
            {
              id: '1',
              title: 'No Professional Advice',
              content: 'PixelTools does not provide legal, financial, or technical advice. The results produced by our tools (e.g., PDF compression, image processing, or calculations) should be verified for accuracy before use in critical, professional, or legal contexts.'
            },
            {
              id: '2',
              title: 'No Warranties',
              content: 'While we strive to provide high-quality, bug-free tools, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the tools contained on it.'
            },
            {
              id: '3',
              title: 'User Responsibility',
              content: 'All processing is performed locally on the user\'s device. PixelTools does not monitor, store, or take responsibility for the files uploaded or the resulting data. Users are solely responsible for their use of the tools and the content they process.'
            },
            {
              id: '4',
              title: 'External Links',
              content: 'Through this website, you may be able to link to other websites which are not under the control of PixelTools. We have no control over the nature, content, and availability of those sites.'
            }
          ].map((section) => (
            <section key={section.id} className="group">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-widest">{section.id}</span>
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{section.title}</h2>
              </div>
              <div className="text-slate-500 font-medium leading-relaxed">
                <p>{section.content}</p>
              </div>
            </section>
          ))}

          <section className="pt-12 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Last Updated: October 24, 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
