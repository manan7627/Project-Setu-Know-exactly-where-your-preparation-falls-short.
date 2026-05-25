import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, LayoutGrid, BarChart3, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthPage = router.pathname === '/login' || router.pathname === '/';
  
  const handleLogout = () => {
    localStorage.removeItem('setu_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-surface-50 text-text-900 flex flex-col font-sans">
      {!isAuthPage && (
        <header className="fixed top-0 w-full z-50 glass-panel">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl tracking-tight text-text-900">
                Project Setu
              </span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className={`text-sm font-medium transition-colors ${router.pathname.includes('/dashboard') ? 'text-brand-600' : 'text-text-700 hover:text-text-900'}`}>
                Dashboard
              </Link>
              <Link href="/analyze" className={`text-sm font-medium transition-colors ${router.pathname.includes('/analyze') ? 'text-brand-600' : 'text-text-700 hover:text-text-900'}`}>
                New Evaluation
              </Link>
              {isClient && localStorage.getItem('setu_token') && (
                <button onClick={handleLogout} className="text-text-500 hover:text-red-500 transition-colors flex items-center space-x-2 text-sm font-medium pl-4 border-l border-gray-200">
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              )}
            </nav>

            {/* Mobile Nav Toggle */}
            <button className="md:hidden text-text-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 flex flex-col space-y-4">
                  <Link href="/dashboard" className="text-text-700 font-medium py-2">Dashboard</Link>
                  <Link href="/analyze" className="text-text-700 font-medium py-2">New Evaluation</Link>
                  <button onClick={handleLogout} className="text-red-500 font-medium py-2 text-left">Sign out</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      <main className={`flex-1 flex flex-col ${!isAuthPage ? 'pt-24 pb-12' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 w-full max-w-7xl mx-auto px-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAuthPage && (
        <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center text-white">
                    <LayoutGrid className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-lg text-text-900">Project Setu</span>
                </div>
                <p className="text-text-500 text-sm max-w-xs">
                  Enterprise-grade academic gap analysis powered by Google Gemini 2.5 Flash.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-text-900 mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-text-500">
                  <li><a href="#" className="hover:text-brand-600">Evaluations</a></li>
                  <li><a href="#" className="hover:text-brand-600">Mock Tests</a></li>
                  <li><a href="#" className="hover:text-brand-600">Analytics</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-text-500">
                  <li><a href="#" className="hover:text-brand-600">About</a></li>
                  <li><a href="#" className="hover:text-brand-600">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-brand-600">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-500">
              <p>© {new Date().getFullYear()} Project Setu Inc. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
