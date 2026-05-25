import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Send, FileText, Settings, ShieldCheck, BookOpen, Brain, Sparkles } from 'lucide-react';
import AppShell from '../components/AppShell';

const getApiBase = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/wp-json';
  if (!url.endsWith('/wp-json')) {
    url = url.replace(/\/$/, '') + '/wp-json';
  }
  return url;
};
const API_BASE = getApiBase();

export default function Analyze() {
  const [content, setContent] = useState('');
  const [targetExam, setTargetExam] = useState('Engineering_Aptitude');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('setu_token')) router.push('/login');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('setu_token');
    try {
      const res = await fetch(`${API_BASE}/setu/v1/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content, target_exam: targetExam })
      });
      const data = await res.json();
      if (res.ok && data.post_id) {
        router.push(`/result/${data.post_id}`);
      } else {
        alert(data.message || 'Submission failed');
        setIsSubmitting(false);
      }
    } catch {
      alert('Network error');
      setIsSubmitting(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mb-5">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">New Evaluation</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">Paste your study notes below. Our AI will analyze depth, accuracy, and completeness against competitive exam standards.</p>
        </div>

        <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card-elevated p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 via-violet-500 to-rose-500" />

          <div className="space-y-6">
            {/* Domain Select */}
            <div>
              <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <Settings className="w-3.5 h-3.5 mr-1.5 text-brand-500" /> Target Domain
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'Engineering_Aptitude', label: 'Engineering & Logic', desc: 'GATE / JEE', icon: Brain },
                  { value: 'Civil_Service_Admin', label: 'Administrative Studies', desc: 'UPSC / State PSC', icon: Sparkles },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTargetExam(opt.value)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${targetExam === opt.value ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                  >
                    <opt.icon className={`w-5 h-5 mb-2 ${targetExam === opt.value ? 'text-brand-600' : 'text-gray-400'}`} />
                    <p className={`font-bold text-sm ${targetExam === opt.value ? 'text-brand-700' : 'text-gray-900'}`}>{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-violet-500" /> Study Notes
                </label>
                <span className={`text-xs font-medium ${wordCount > 50 ? 'text-emerald-500' : 'text-gray-300'}`}>
                  {wordCount} words
                </span>
              </div>
              <textarea
                rows={14}
                className="input-field font-mono text-sm leading-relaxed resize-y"
                placeholder="Paste your comprehensive notes here for deep AI evaluation..."
                value={content} onChange={e => setContent(e.target.value)}
                required
              />
            </div>

            {/* Info Banner */}
            <div className="flex items-start space-x-3 bg-brand-50 border border-brand-100 rounded-xl p-4">
              <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-brand-900 mb-0.5">Secure Processing</p>
                <p className="text-xs text-brand-700/70">Your submission is processed by Gemini 2.5 Flash. Results typically appear in 5–10 seconds.</p>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${isSubmitting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}>
              {isSubmitting ? (
                <><div className="w-5 h-5 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mr-2" />Analyzing...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" />Start Analysis</>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </AppShell>
  );
}
