import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LogOut, Menu, X, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const handleLogout = () => {
    localStorage.removeItem('setu_token');
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/analyze', label: 'New Evaluation' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col font-sans">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Setu" width={24} height={24} className="rounded-md" />
            <span className="font-bold text-base tracking-tight">Setu</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className={`text-sm font-medium transition-colors ${router.pathname === l.href ? 'text-brand-600' : 'text-gray-500 hover:text-gray-900'}`}>{l.label}</Link>
            ))}
            {isClient && localStorage.getItem('setu_token') && (
              <button onClick={handleLogout} className="flex items-center space-x-1.5 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors pl-4 border-l border-gray-200">
                <LogOut className="w-3.5 h-3.5" /><span>Sign out</span>
              </button>
            )}
          </nav>
          <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden bg-white border-t border-gray-100">
              <div className="px-6 py-4 space-y-3">
                {navLinks.map(l => <Link key={l.href} href={l.href} className="block text-sm font-medium text-gray-700 py-1">{l.label}</Link>)}
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 py-1">Sign out</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-5">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Setu. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
