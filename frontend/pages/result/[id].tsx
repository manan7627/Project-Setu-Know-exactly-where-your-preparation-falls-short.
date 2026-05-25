import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, Brain, Activity, ArrowLeft, Target } from 'lucide-react';
import Link from 'next/link';
import AppShell from '../../components/AppShell';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/wp-json';

export default function Result() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const fetchData = async () => {
    if (!id) return;
    const token = localStorage.getItem('setu_token');
    try {
      const res = await fetch(`${API_BASE}/setu/v1/results/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.status === 404) { setError('Result not found.'); return; }
      const json = await res.json();
      setData(json);
    } catch { /* retry */ }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
    const interval = setInterval(() => {
      if (data?.eval_status === 'pending' || data?.eval_status === 'processing') fetchData();
    }, 3000);
    return () => clearInterval(interval);
  }, [id, data?.eval_status]);

  if (error) return (
    <AppShell>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Error</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    </AppShell>
  );

  if (!data) return (
    <AppShell>
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-[3px] border-gray-200 border-t-brand-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-medium text-sm">Loading evaluation data...</p>
      </div>
    </AppShell>
  );

  const isPending = data.eval_status === 'pending' || data.eval_status === 'processing';
  const isFailed = data.eval_status === 'failed';
  const handleSelect = (qi: number, opt: string) => setSelectedAnswers(p => ({ ...p, [qi]: opt }));

  const scoreColor = data.readiness_score >= 76 ? 'emerald' : data.readiness_score >= 41 ? 'amber' : 'red';
  const scoreLabel = data.readiness_score >= 76 ? 'Excellent' : data.readiness_score >= 41 ? 'Moderate' : 'Needs Work';

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-20">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        {isFailed && (
          <div className="card-elevated border-red-200 p-8 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-1">Evaluation Failed</h2>
            <p className="text-gray-500 text-sm">The AI evaluation failed. Please check the Gemini API key or try again.</p>
          </div>
        )}

        {isPending && (
          <div className="card-elevated p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 via-violet-500 to-rose-500 animate-pulse" />
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-[3px] border-gray-100 rounded-full" />
              <div className="absolute inset-0 border-[3px] border-brand-600 border-t-transparent rounded-full animate-spin" />
              <Brain className="absolute inset-0 m-auto w-8 h-8 text-brand-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Analyzing Submission</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">Gemini 2.5 Flash is evaluating your notes. This typically takes 5–10 seconds.</p>
          </div>
        )}

        {!isPending && !isFailed && data.readiness_score !== undefined && (
          <div className="space-y-8">
            {/* Score + Summary Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-elevated p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-${scoreColor}-500`} />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5" /><span>Readiness Score</span>
                </p>
                <div className="relative w-36 h-36 mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15.9155" fill="none"
                      stroke={data.readiness_score >= 76 ? '#10b981' : data.readiness_score >= 41 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="3" strokeLinecap="round"
                      initial={{ strokeDasharray: '0, 100' }}
                      animate={{ strokeDasharray: `${data.readiness_score}, 100` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-900">{data.readiness_score}</span>
                    <span className="text-xs font-bold text-gray-400">/ 100</span>
                  </div>
                </div>
                <span className={`badge bg-${scoreColor}-50 text-${scoreColor}-700 border border-${scoreColor}-200`}>{scoreLabel}</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-8 lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-gray-900">Evaluation Critique</h3>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{data.evaluation_summary}</p>
              </motion.div>
            </div>

            {/* Skill Gaps */}
            {data.skill_gaps && data.skill_gaps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /><span>Identified Skill Gaps</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.skill_gaps.map((gap: string, i: number) => (
                    <div key={i} className="flex items-start space-x-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 font-bold text-xs mt-0.5">{i + 1}</div>
                      <span className="text-sm text-amber-900 font-medium leading-relaxed">{gap}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mock Test */}
            {data.mock_test && data.mock_test.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center justify-between mb-6 mt-12">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-violet-500" /><span>Tailored Mock Test</span>
                  </h3>
                  <span className="badge bg-violet-50 text-violet-700 border border-violet-200">{data.mock_test.length} Questions</span>
                </div>

                <div className="space-y-5">
                  {data.mock_test.map((q: any, i: number) => {
                    const selected = selectedAnswers[i];
                    const isCorrect = selected === q.correct_answer;
                    const hasAnswered = !!selected;
                    return (
                      <div key={i} className="card-elevated p-6">
                        <div className="flex items-start space-x-3 mb-5">
                          <span className="text-lg font-black text-gray-200">Q{i+1}.</span>
                          <p className="font-semibold text-gray-900 leading-relaxed">{q.question}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map((opt: string, j: number) => {
                            let cls = "text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ";
                            if (!hasAnswered) cls += "border-gray-200 bg-gray-50 text-gray-700 hover:border-brand-300 hover:bg-brand-50 cursor-pointer";
                            else if (opt === q.correct_answer) cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
                            else if (opt === selected) cls += "border-red-400 bg-red-50 text-red-800";
                            else cls += "border-gray-100 bg-gray-50 text-gray-300";
                            return <button key={j} disabled={hasAnswered} onClick={() => handleSelect(i, opt)} className={cls}>{opt}</button>;
                          })}
                        </div>
                        <AnimatePresence>
                          {hasAnswered && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`mt-4 p-4 rounded-xl flex items-start space-x-3 text-sm ${isCorrect ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                              {isCorrect ? (
                                <><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /><div><p className="font-bold text-emerald-700">Correct!</p><p className="text-emerald-600 text-xs mt-0.5">Your understanding is solid here.</p></div></>
                              ) : (
                                <><XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><div><p className="font-bold text-red-700">Incorrect</p><p className="text-red-600 text-xs mt-0.5">Correct answer: <strong>{q.correct_answer}</strong></p></div></>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
