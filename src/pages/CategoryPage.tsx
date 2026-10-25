import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CATEGORIES, TOOLS } from '../data/tools';
import { ArrowLeft, ChevronRight, MousePointer2, Shield } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';

export default function CategoryPage() {
  const { category } = useParams();
  const categoryData = CATEGORIES.find(c => c.id === category);
  const categoryTools = TOOLS.filter(t => t.category === category);

  if (!categoryData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Resource Not Found</h1>
        <p className="text-slate-500 mb-8 font-medium">The tool collection you are looking for does not exist or has been moved.</p>
        <Link to="/" className="premium-button-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Terminal
        </Link>
      </div>
    );
  }

  const Icon = categoryData.icon;

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{categoryData.name} – Professional Utilities | PixelTools</title>
        <meta name="description" content={categoryData.description} />
      </Helmet>

      <div className="bg-slate-50/50 border-b border-slate-200/60 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10 hover:text-indigo-600 transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-center text-indigo-600 shrink-0">
              <Icon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{categoryData.name}</h1>
              <p className="text-lg text-slate-500 max-w-3xl font-medium leading-relaxed">{categoryData.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] as any }}
            >
              <Link 
                to={tool.href}
                className="premium-card premium-card-hover group flex flex-col p-8 h-full"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0 mb-6 group-hover:scale-105 transition-transform shadow-sm">
                  <tool.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight">{tool.name}</h3>
                  <p className="text-[14px] text-slate-500 mb-8 line-clamp-2 font-medium leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="text-indigo-600 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-2 mt-auto">
                    Launch <MousePointer2 className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <AdPlaceholder id="category-top" variant="horizontal" className="mt-20" />
        
        {/* SEO / Info Section */}
        <div className="mt-32 max-w-4xl mx-auto border-t border-slate-100 pt-24">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Why use PixelTools {categoryData.name}?</h2>
          <div className="prose prose-slate max-w-none text-slate-500 font-medium leading-relaxed">
            <p className="mb-10 text-lg">
              Our {categoryData.name.toLowerCase()} suite is engineered for uncompromising performance and total data privacy. 
              By leveraging client-side edge computing, we eliminate the need for server uploads, ensuring your professional 
              data remains entirely under your control.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div>
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                <MousePointer2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Zero-Install Runtime</h3>
              <p className="text-slate-500 text-[14px] leading-relaxed font-medium">All utilities execute directly in your browser. No heavy software packages, plugins, or registration required.</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-6">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Bit-Perfect Accuracy</h3>
              <p className="text-slate-500 text-[14px] leading-relaxed font-medium">We utilize industry-standard document and imaging engines to ensure every export meets professional quality standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
