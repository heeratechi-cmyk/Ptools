import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Github, Twitter, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'PDF Tools', href: '/pdf-tools' },
  { name: 'Image Tools', href: '/image-tools' },
  { name: 'Text Tools', href: '/text-tools' },
  { name: 'Developer Tools', href: '/developer-tools' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Top Bar Contract: [Brand] — [4-5 Links] — [1 Primary Action] */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group">
            <img 
              src="/logo.png" 
              alt="PixelTools Logo" 
              className="w-9 h-9 object-contain rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105" 
            />
            <span className="font-extrabold tracking-tight">PixelTools</span>
          </Link>

          {/* Zone 2: Navigation Links (4-5 items, concise) */}
          <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {navigation.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 tracking-wide uppercase ${
                    isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Zone 3: Primary Action */}
          <div className="hidden md:flex items-center shrink-0">
            <Link to="/pdf-tools" className="premium-button-primary text-xs uppercase tracking-widest">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-xl"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navigation.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    className={({ isActive }) =>
                      `block px-4 py-4 text-sm font-bold rounded-xl transition-all ${
                        isActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                <div className="pt-4 px-2">
                   <Link to="/pdf-tools" className="premium-button-primary w-full block text-center py-3.5">
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <AnimatePresence 
          mode="wait"
          onExitComplete={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-slate-50/80 border-t border-slate-200/60 pt-20 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 mb-5 group">
                <img 
                  src="/logo.png" 
                  alt="PixelTools Logo" 
                  className="w-8 h-8 object-contain rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105" 
                />
                <span className="font-extrabold tracking-tight">PixelTools</span>
              </Link>
              <p className="text-slate-500 text-[13px] max-w-xs mb-8 leading-relaxed font-medium">
                Professional online utilities for modern digital workflows. 100% free, private, and powered by browser-native technology.
              </p>
              <div className="flex items-center gap-5">
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Github className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Utilities</h4>
              <ul className="space-y-3">
                {navigation.map(link => (
                  <li key={link.href}>
                    <NavLink to={link.href} className={({isActive}) => `text-[13px] font-semibold transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><NavLink to="/about" className={({isActive}) => `text-[13px] font-semibold transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>About Us</NavLink></li>
                <li><NavLink to="/contact" className={({isActive}) => `text-[13px] font-semibold transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Contact</NavLink></li>
                <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Sitemap (XML)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><NavLink to="/privacy" className={({isActive}) => `text-[13px] font-semibold transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Privacy Policy</NavLink></li>
                <li><NavLink to="/terms" className={({isActive}) => `text-[13px] font-semibold transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Terms & Service</NavLink></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[12px] font-medium text-slate-400">
              © {new Date().getFullYear()} PixelTools Studio.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
