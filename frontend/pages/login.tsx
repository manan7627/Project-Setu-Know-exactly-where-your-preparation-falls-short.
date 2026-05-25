import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Lock, User, ArrowRight, CheckCircle2, BarChart3, Sparkles, Shield, Mail } from 'lucide-react';
import Link from 'next/link';

const getApiBase = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/wp-json';
  if (!url.endsWith('/wp-json')) {
    url = url.replace(/\/$/, '') + '/wp-json';
  }
  return url;
};
const API_BASE = getApiBase();

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isSignUp ? `${API_BASE}/setu/v1/register` : `${API_BASE}/setu/v1/login`;
    const payload = isSignUp ? { username, email, password } : { username, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('setu_token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || (isSignUp ? 'Registration failed' : 'Invalid credentials'));
        setIsLoading(false);
      }
    } catch (err) {
      setError('Connection error — is the backend running?');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-[0.04] dot-grid-bg" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-600/15 rounded-full blur-[120px]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2.5 mb-16">
            <Image src="/logo.png" alt="Setu" width={32} height={32} className="rounded-md brightness-200" />
            <span className="font-bold text-xl">Setu</span>
          </Link>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
            The smartest way to<br />prepare for exams.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-12">
            AI-powered gap analysis that pinpoints exactly where your preparation falls short.
          </p>

          <div className="space-y-5">
            {[
              { icon: BarChart3, text: 'Readiness scores in under 10 seconds' },
              { icon: Sparkles, text: 'Powered by Google Gemini 2.5 Flash' },
              { icon: Shield, text: 'Enterprise-grade security & privacy' },
              { icon: CheckCircle2, text: 'Trusted by 50,000+ aspirants' },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-brand-400" />
                </div>
                <span className="text-gray-300 font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-sm text-gray-500">"Setu helped me jump from 45% to 82% readiness in just 3 weeks."</p>
          <p className="text-sm font-semibold text-white mt-2">— Priya Sharma, UPSC AIR 47</p>
        </div>
      </div>

      {/* Right Panel — Login/Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center space-x-2 mb-10">
            <Image src="/logo.png" alt="Setu" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-lg">Setu</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-gray-500 mb-8">
            {isSignUp ? 'Start identifying your knowledge gaps in seconds.' : 'Enter your credentials to access your dashboard.'}
          </p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" className="input-field pl-10" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            </div>
            
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" className="input-field pl-10" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" className="input-field pl-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center transition-all ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              ) : (
                <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            {isSignUp ? (
              <>Already have an account? <button type="button" onClick={() => { setIsSignUp(false); setError(''); }} className="text-brand-600 font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer">Sign in</button></>
            ) : (
              <>Don't have an account? <button type="button" onClick={() => { setIsSignUp(true); setError(''); }} className="text-brand-600 font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer">Create account</button></>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
