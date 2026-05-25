import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Award, Calendar, ChevronRight, Activity, Plus, Target, TrendingUp, Brain, Clock } from 'lucide-react';
import AppShell from '../components/AppShell';

const getApiBase = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/wp-json';
  if (!url.endsWith('/wp-json')) {
    url = url.replace(/\/$/, '') + '/wp-json';
  }
  return url;
};
const API_BASE = getApiBase();

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('setu_token');
    if (!token) { router.push('/login'); return; }
    fetch(`${API_BASE}/setu/v1/results`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => { if (Array.isArray(data)) setSubmissions(data); setIsLoading(false); })
    .catch(() => setIsLoading(false));
  }, []);

  const completed = submissions.filter(s => s.eval_status === 'completed');
  const avgScore = completed.length > 0 ? Math.round(completed.reduce((a, c) => a + (c.readiness_score || 0), 0) / completed.length) : 0;
  const topScore = completed.length > 0 ? Math.max(...completed.map(c => c.readiness_score || 0)) : 0;

  const getScoreBadge = (score: number) => {
    if (score >= 76) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 41) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your evaluations and performance metrics.</p>
          </div>
          <Link href="/analyze" className="btn-primary text-sm">
            <Plus className="w-4 h-4 mr-1.5" /> New Evaluation
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Total Evaluations', value: submissions.length, color: 'text-brand-600 bg-brand-50' },
            { icon: Award, label: 'Avg. Score', value: `${avgScore}%`, color: 'text-emerald-600 bg-emerald-50' },
            { icon: TrendingUp, label: 'Best Score', value: `${topScore}%`, color: 'text-violet-600 bg-violet-50' },
            { icon: Clock, label: 'Last Evaluation', value: submissions.length > 0 ? new Date(submissions[0].date).toLocaleDateString() : '—', color: 'text-amber-600 bg-amber-50' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-elevated p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/analyze" className="card-elevated p-5 flex items-center space-x-4 group hover:border-brand-200">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-100 transition-colors">
              <Brain className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">Engineering Domain</p>
              <p className="text-xs text-gray-400">Submit for GATE / JEE evaluation</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
          </Link>
          <Link href="/analyze" className="card-elevated p-5 flex items-center space-x-4 group hover:border-violet-200">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-100 transition-colors">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">Civil Services</p>
              <p className="text-xs text-gray-400">Submit for UPSC evaluation</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors" />
          </Link>
          <div className="card-elevated p-5 flex items-center space-x-4 opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">Medical Sciences</p>
              <p className="text-xs text-gray-400">Coming soon</p>
            </div>
            <span className="badge bg-gray-100 text-gray-500 text-[10px]">Soon</span>
          </div>
        </div>

        {/* Submissions Table */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Submissions</h2>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-[3px] border-gray-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="card-elevated text-center py-20 border-dashed">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">No evaluations yet</h3>
              <p className="text-sm text-gray-400 mb-5">Submit your first academic notes for AI analysis.</p>
              <Link href="/analyze" className="btn-primary text-sm">Create First Evaluation</Link>
            </div>
          ) : (
            <div className="card-elevated overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Domain</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Score</div>
                <div className="col-span-1"></div>
              </div>
              {/* Table Rows */}
              <div className="divide-y divide-gray-50">
                {submissions.map((sub, i) => (
                  <Link key={sub.id} href={`/result/${sub.id}`}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50/70 transition-colors group cursor-pointer items-center">
                      <div className="col-span-5">
                        <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600 transition-colors truncate">{sub.title}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500 font-medium">{sub.target_exam.replace('_', ' ')}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-gray-400">{new Date(sub.date).toLocaleDateString()}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        {sub.eval_status === 'completed' ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold border ${getScoreBadge(sub.readiness_score)}`}>
                            {sub.readiness_score}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium animate-pulse capitalize">{sub.eval_status}</span>
                        )}
                      </div>
                      <div className="col-span-1 text-right">
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors inline-block" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
