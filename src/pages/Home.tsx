import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowRight, Zap, Shield, Globe, MousePointer2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { TOOLS, CATEGORIES } from '../data/tools';
import AdPlaceholder from '../components/AdPlaceholder';

const SUGGESTED_SEARCHES = ['Merge PDF', 'Compress Image', 'WebP Converter', 'JSON Formatter'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }
  }
};

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  const popularTools = TOOLS.filter(tool => tool.popular).slice(0, 6);

  return (
    <div className="bg-white">
      <Helmet>
        <title>PixelTools – Professional Online PDF & Image Utilities</title>
        <meta name="description" content="Access professional online tools for PDF, images, and developer utilities. Fast, free, and privacy-focused." />
      </Helmet>
      
      <AdPlaceholder id="home-top" variant="horizontal" className="mt-6 mb-0" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-[11px] font-bold uppercase tracking-[0.15em] mb-8">
              <Zap className="w-3.5 h-3.5 fill-indigo-600" />
              <span>Edge-Computing Powered Utilities</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.05]">
              Accelerate your <span className="text-indigo-600">digital workflow</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-[17px] text-slate-500 mb-12 max-w-2xl leading-relaxed font-medium">
              High-fidelity tools for PDF editing, image optimization, and developers. Distributed processing ensures your files never leave your device.
            </motion.p>
            
            <motion.div variants={itemVariants} className="w-full max-w-2xl">
              {/* Isolated search box container for perfect icon centering */}
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Find a tool (e.g., merge pdf, compress image)"
                  className="block w-full pl-12 pr-11 py-4 sm:py-4.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm text-[15px] sm:text-base leading-normal"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Dropdown positioned directly beneath the search input */}
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 overflow-hidden text-left">
                    {filteredTools.length > 0 ? (
                      filteredTools.map(tool => (
                        <Link 
                          key={tool.id} 
                          to={tool.href}
                          className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-100 group"
                        >
                          <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                            <tool.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-bold text-slate-900">{tool.name}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{tool.category.replace('-', ' ')}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </Link>
                      ))
                    ) : (
                      <div className="p-8 text-sm text-slate-500 text-center font-medium italic">No tools matching "{searchQuery}"</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Popular tags below search box */}
              <div className="mt-4 flex flex-wrap justify-center gap-2 items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">Popular:</span>
                {SUGGESTED_SEARCHES.map(term => (
                  <button 
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-600 hover:border-indigo-600/30 hover:text-indigo-600 transition-all active:scale-95"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Most Used Utilities</h2>
              <p className="text-slate-500 font-medium">Standard tools used by thousands of professionals daily.</p>
            </div>
            <Link to="/pdf-tools" className="text-indigo-600 font-bold text-[13px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              Browse Entire Directory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link 
                  to={tool.href}
                  className="premium-card premium-card-hover group block p-8 h-full"
                >
                  <div className="w-13 h-13 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-[-4deg] shadow-sm shadow-indigo-100/50">
                    <tool.icon className="w-6.5 h-6.5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                  <p className="text-slate-500 text-[14px] mb-8 leading-relaxed font-medium">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-[12px] uppercase tracking-[0.1em]">
                    Launch Tool <MousePointer2 className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AdPlaceholder id="home-middle" variant="horizontal" />

      {/* Category Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Functional Ecosystems</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">Explore organized sets of specialized tools for any professional task.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link 
                  to={cat.href || `/${cat.id}`}
                  className="group flex flex-col h-full p-10 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50/80 transition-all text-center items-center shadow-sm"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-200/30">
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{cat.name}</h3>
                  <p className="text-slate-500 text-[14px] leading-relaxed mb-8 font-medium">
                    {cat.description}
                  </p>
                  <div className="mt-auto text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-600 transition-colors">
                    Explore Collection
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="py-24 bg-indigo-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-indigo-400 rounded-full blur-[100px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-16 text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-15 h-15 bg-indigo-800/80 rounded-2xl flex items-center justify-center mb-8 border border-indigo-700/50 backdrop-blur-sm">
                <Shield className="w-7 h-7 text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Zero-Knowledge Processing</h3>
              <p className="text-indigo-200/80 leading-relaxed font-medium text-[15px]">
                Files are processed locally via browser APIs. We never store, see, or transmit your data to external servers.
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-15 h-15 bg-indigo-800/80 rounded-2xl flex items-center justify-center mb-8 border border-indigo-700/50 backdrop-blur-sm">
                <Zap className="w-7 h-7 text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Instant Rendering</h3>
              <p className="text-indigo-200/80 leading-relaxed font-medium text-[15px]">
                Bypass traditional upload bottlenecks. Our tools operate at the speed of your hardware, ensuring zero latency.
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-15 h-15 bg-indigo-800/80 rounded-2xl flex items-center justify-center mb-8 border border-indigo-700/50 backdrop-blur-sm">
                <Globe className="w-7 h-7 text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Enterprise Availability</h3>
              <p className="text-indigo-200/80 leading-relaxed font-medium text-[15px]">
                100% free, always online, and accessible from any modern browser without accounts or subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdPlaceholder id="home-bottom" variant="horizontal" />
      
      {/* FAQ Section */}
      <section className="py-24 bg-slate-50/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Operational Insight</h2>
            <p className="text-slate-500 font-medium">Frequently asked questions about PixelTools infrastructure.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Are my files secure?</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-[14px]">
                PixelTools utilizes the latest WebAssembly and Canvas standards to perform all computation on your machine. This architectural choice means your data never leaves your device's memory.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Is there a maximum file size?</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-[14px]">
                Memory limits are determined by your browser. We recommend files under 200MB for optimal stability, though higher limits may work on high-memory devices.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Can I use PixelTools for commercial work?</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-[14px]">
                Absolutely. PixelTools is designed for professional use. All processed files are yours to keep without watermarks or licensing restrictions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
