import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <Helmet>
        <title>Terms of Service – PixelTools</title>
        <meta name="description" content="Read the terms and conditions for using PixelTools." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6">
            Legal Agreement
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">
            Please read these terms carefully before using PixelTools. By using our services, you agree to these terms.
          </p>
        </div>

        <div className="space-y-20">
          {[
            {
              id: '1',
              title: 'Acceptance of Terms',
              content: 'By accessing and using PixelTools, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services. These terms apply to all visitors, users, and others who access or use the Service.'
            },
            {
              id: '2',
              title: 'Use of Service',
              content: 'PixelTools provides free online utilities for personal and professional use. You agree to use the service only for lawful purposes. You are prohibited from:',
              list: [
                'Using the service for any illegal activity.',
                'Attempting to interfere with the proper working of the site.',
                'Automating access to the site through bots or scrapers without permission.',
                'Uploading malicious code or files intended to harm the service.'
              ]
            },
            {
              id: '3',
              title: 'Intellectual Property',
              content: 'The design, code, logos, and original content of PixelTools are the exclusive intellectual property of PixelTools. User-provided files remain the property of the user and are never stored or claimed by PixelTools.'
            },
            {
              id: '4',
              title: 'Limitation of Liability',
              content: 'PixelTools is provided "as is" without any warranties. We are not liable for any damages arising from the use of our tools, including data loss or system errors. Processing is performed on the user\'s device, and the user bears full responsibility for the files they process.'
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
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                        <span className="text-[13px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
