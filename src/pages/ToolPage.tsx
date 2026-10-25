import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOLS } from '../data/tools';
import { ArrowLeft, Share2, Info, MessageSquare } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';
import SEOHead from '../components/SEOHead';
import { getSEOForPath } from '../data/seoData';

// Tool Components (to be implemented)
import TextToPdf from '../tools/pdf/TextToPdf';
import ImageToPdf from '../tools/pdf/ImageToPdf';
import MergePdf from '../tools/pdf/MergePdf';
import SplitPdf from '../tools/pdf/SplitPdf';
import CompressPdf from '../tools/pdf/CompressPdf';
import PdfPageCounter from '../tools/pdf/PdfPageCounter';
import PdfWatermark from '../tools/pdf/PdfWatermark';

import ImageCompressor from '../tools/image/ImageCompressor';
import ImageResizer from '../tools/image/ImageResizer';
import JpgToPng from '../tools/image/JpgToPng';
import PngToJpg from '../tools/image/PngToJpg';
import WebpConverter from '../tools/image/WebpConverter';
import ImageCropper from '../tools/image/ImageCropper';

import WordCounter from '../tools/text/WordCounter';
import CaseConverter from '../tools/text/CaseConverter';

import JsonFormatter from '../tools/dev/JsonFormatter';
import Base64Tool from '../tools/dev/Base64Tool';
import UrlEncoder from '../tools/dev/UrlEncoder';
import HtmlFormatter from '../tools/dev/HtmlFormatter';
import CssMinifier from '../tools/dev/CssMinifier';
import JsMinifier from '../tools/dev/JsMinifier';

import PercentageCalculator from '../tools/calc/PercentageCalculator';

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'text-to-pdf': TextToPdf,
  'image-to-pdf': ImageToPdf,
  'merge-pdf': MergePdf,
  'split-pdf': SplitPdf,
  'compress-pdf': CompressPdf,
  'pdf-page-counter': PdfPageCounter,
  'pdf-watermark': PdfWatermark,
  'image-compressor': ImageCompressor,
  'image-resizer': ImageResizer,
  'jpg-to-png': JpgToPng,
  'png-to-jpg': PngToJpg,
  'webp-converter': WebpConverter,
  'image-cropper': ImageCropper,
  'word-counter': WordCounter,
  'case-converter': CaseConverter,
  'json-formatter': JsonFormatter,
  'base64-encoder': Base64Tool,
  'url-encoder': UrlEncoder,
  'html-formatter': HtmlFormatter,
  'css-minifier': CssMinifier,
  'js-minifier': JsMinifier,
  'percentage-calculator': PercentageCalculator,
};

export default function ToolPage() {
  const { toolId } = useParams();
  const tool = TOOLS.find(t => t.id === toolId);
  const ToolComponent = toolId ? TOOL_COMPONENTS[toolId] : null;

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Tool not found</h1>
        <Link to="/" className="mt-4 text-indigo-600 inline-block">Back to home</Link>
      </div>
    );
  }

  const seo = getSEOForPath(`/tools/${tool.id}`);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is the ${tool.name} free to use?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all tools on PixelTools are 100% free with no hidden costs, watermarks, or subscription requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We use browser-native processing, meaning your files never leave your computer. We don't store or even see your data."
        }
      },
      {
        "@type": "Question",
        "name": "What devices are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PixelTools works on all modern devices, including mobile phones, tablets, and desktops running any operating system."
        }
      }
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEOHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        schema={faqSchema}
      />

      <div className="bg-white border-b border-slate-200 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to={`/${tool.category}`} 
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {tool.category.replace('-', ' ')}
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Share Tool">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
              <tool.icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{tool.name}</h1>
              <p className="text-slate-500 text-sm">{tool.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <AdPlaceholder id="tool-top" variant="horizontal" className="mt-0 mb-8" />
            {ToolComponent ? (
              <div className="premium-card overflow-hidden min-h-[400px]">
                <ToolComponent />
              </div>
            ) : (
              <div className="premium-card p-12 text-center">
                <p className="text-slate-500 font-medium">This tool is coming soon.</p>
              </div>
            )}
            
            <AdPlaceholder id="tool-after-result" variant="horizontal" className="mt-8 mb-0" />
            
            {/* Tool Information */}
            <div className="mt-16 space-y-16">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Info className="w-5 h-5" />
                  </div>
                  How to use {tool.name}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600">
                  <p className="text-lg leading-relaxed mb-8">
                    Using PixelTools is designed to be simple, fast, and secure. Follow these straightforward steps to get the best results with the {tool.name}:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { step: 1, title: 'Upload File', desc: 'Drag and drop your file into the upload zone or click "Select File".' },
                      { step: 2, title: 'Local Processing', desc: 'Wait a brief moment as our tool processes your data locally in your browser.' },
                      { step: 3, title: 'Review Results', desc: 'Preview the output and adjust any available settings to match your needs.' },
                      { step: 4, title: 'Download Securely', desc: 'Instantly download your processed file without it ever hitting a server.' },
                    ].map((item) => (
                      <div key={item.step} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Step {item.step}</div>
                        <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  Frequently Asked Questions
                </h2>
                <div className="grid gap-4">
                  {[
                    { q: `Is the ${tool.name} free to use?`, a: "Yes, all tools on PixelTools are 100% free with no hidden costs, watermarks, or subscription requirements." },
                    { q: "Is my data secure?", a: "Absolutely. We use browser-native processing, meaning your files never leave your computer. We don't store or even see your data." },
                    { q: "What devices are supported?", a: "PixelTools works on all modern devices, including mobile phones, tablets, and desktops running any operating system." }
                  ].map((faq, i) => (
                    <div key={i} className="premium-card p-6">
                      <h3 className="font-bold text-slate-900 mb-3">{faq.q}</h3>
                      <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="sticky top-28 space-y-10">
              <AdPlaceholder id="sidebar" variant="sidebar" className="my-0" />
              
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Related Utilities</h3>
                <div className="space-y-3">
                  {TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 5).map(related => (
                    <Link 
                      key={related.id} 
                      to={related.href}
                      className="premium-card premium-card-hover flex items-center gap-4 p-4 group"
                    >
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                        <related.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{related.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
