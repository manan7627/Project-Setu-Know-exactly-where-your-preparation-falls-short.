import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, BarChart3, Brain, Zap, Target, Shield, 
  BookOpen, ChevronRight, ChevronDown, Sparkles, Award, TrendingUp,
  FileText, Clock, Globe, Check, Menu, X, Layers, GraduationCap,
  MessageSquare, Settings, Activity
} from 'lucide-react';

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  const faqs = [
    { q: 'What kind of content can I submit for evaluation?', a: 'You can submit academic essays, study notes, answer practice sheets, or any written preparation material. The AI evaluates depth of knowledge, factual accuracy, structural coherence, and completeness against competitive exam standards.' },
    { q: 'How does the AI scoring work?', a: 'Your submission is analyzed by Google Gemini 2.5 Flash against the expected syllabus depth for your chosen exam domain. It produces a Readiness Score (0-100), identifies specific knowledge gaps, and generates targeted MCQs to help you improve.' },
    { q: 'Which exam domains are currently supported?', a: 'We currently support Engineering & Technical (GATE, JEE-level analysis) and Administrative & Governance (UPSC, State PSC-level analysis). More domains including Medical Sciences and Law are being developed.' },
    { q: 'Is my submitted content stored or shared?', a: 'Your submissions are stored securely in your personal account for your own reference and progress tracking. We never share, sell, or use your content for any purpose beyond generating your evaluation.' },
    { q: 'How long does an evaluation take?', a: 'Most evaluations complete in 5-15 seconds depending on the length of your submission. You will see the results update in real-time on your dashboard.' },
  ];

  return (
    <div className="bg-warm-50 text-gray-900 overflow-hidden">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="container-main flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2.5">
            <Image src="/logo.png" alt="Setu" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-lg tracking-tight">Setu</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#capabilities" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Capabilities</a>
            <a href="#faq" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">Log in</Link>
            <Link href="/login" className="btn-primary !py-2.5 !px-5 text-sm">
              Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileNav && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
            <a href="#how-it-works" className="block text-sm font-medium text-gray-700 py-1">How it Works</a>
            <a href="#capabilities" className="block text-sm font-medium text-gray-700 py-1">Capabilities</a>
            <a href="#faq" className="block text-sm font-medium text-gray-700 py-1">FAQ</a>
            <Link href="/login" className="block btn-primary text-sm text-center mt-2">Get Started</Link>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand-100/40 via-violet-50/30 to-transparent rounded-full blur-[80px] pointer-events-none" />

        <div className="container-main relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <span className="badge bg-brand-50 text-brand-700 border border-brand-200 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Academic Evaluation</span>
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Know exactly where your<br />preparation falls short.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
              className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8"
            >
              Setu evaluates your academic notes against competitive exam standards using Google Gemini&nbsp;2.5&nbsp;Flash — identifying gaps and generating targeted practice questions in seconds.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
            >
              <Link href="/login" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
                Start Your First Analysis <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#how-it-works" className="btn-outline text-base px-8 py-4 w-full sm:w-auto">
                See How It Works
              </a>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs text-gray-400 font-medium">
              Free to use · No credit card required · Results in seconds
            </motion.p>
          </div>

          {/* Hero Preview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-2xl shadow-gray-200/40 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center space-x-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
                <div className="flex-1 text-center">
                  <span className="text-xs text-gray-400 font-medium bg-white px-4 py-1 rounded-md border border-gray-100">setu.app/dashboard</span>
                </div>
              </div>
              {/* Simulated dashboard */}
              <div className="p-6 md:p-8 bg-warm-50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Image src="/logo.png" alt="Setu" width={24} height={24} className="rounded-md" />
                    <span className="font-bold text-sm text-gray-900">Dashboard</span>
                  </div>
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Live</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Readiness Score', value: '78%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Gaps Found', value: '3', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Questions Generated', value: '10', color: 'text-brand-600', bg: 'bg-brand-50' },
                  ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
                      <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Skill Gap Analysis</span>
                  </div>
                  <div className="space-y-2">
                    {['Lacks depth in Constitutional Amendment procedures', 'Missing comparative analysis of federal structures'].map((gap, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        <span className="text-gray-600">{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="section-padding bg-white border-y border-gray-100">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">How Setu works</h2>
            <p className="text-gray-500">Three simple steps from submission to actionable insights.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { step: '1', icon: FileText, title: 'Submit your notes', desc: 'Paste your academic essay, study notes, or answer practice into the evaluation form. Select your target exam domain.' },
              { step: '2', icon: Brain, title: 'AI evaluates your work', desc: 'Gemini 2.5 Flash analyzes depth, accuracy, structure, and completeness against competitive exam standards in seconds.' },
              { step: '3', icon: Award, title: 'Get actionable results', desc: 'Receive a readiness score, detailed critique, list of specific knowledge gaps, and a personalized MCQ practice test.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-5 text-brand-600">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES ─── */}
      <section id="capabilities" className="section-padding bg-warm-50">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Built for serious preparation</h2>
            <p className="text-gray-500">Every feature designed to give you a real edge in competitive exams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BarChart3, title: 'Readiness Scoring', desc: 'Get a 0-100 score reflecting how prepared your notes are for competitive exam evaluation, with color-coded tiers.', accent: 'brand' },
              { icon: Target, title: 'Precision Gap Analysis', desc: 'AI identifies exactly which topics, arguments, or frameworks are missing or insufficient in your submission.', accent: 'amber' },
              { icon: Brain, title: 'Adaptive Mock Tests', desc: 'Auto-generated MCQs that target your specific weak points — no generic question banks, only what you need.', accent: 'violet' },
              { icon: BookOpen, title: 'Detailed Critique', desc: 'Receive a written evaluation explaining why your score is what it is, with specific suggestions for improvement.', accent: 'emerald' },
              { icon: Layers, title: 'Multi-Domain Support', desc: 'Evaluate against Engineering (GATE/JEE), Administrative (UPSC/PSC), with Medical and Law domains coming soon.', accent: 'rose' },
              { icon: Clock, title: 'Instant Results', desc: 'Full evaluation, gap analysis, and mock test generated in 5-15 seconds. No waiting, no queues.', accent: 'brand' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Track your readiness scores over time across multiple submissions. See your improvement visually.', accent: 'emerald' },
              { icon: Shield, title: 'Private & Secure', desc: 'Your notes are stored only in your personal account. We never share or use your content beyond evaluation.', accent: 'violet' },
              { icon: Settings, title: 'Evaluation History', desc: 'Access all your past evaluations, scores, and mock tests anytime from your dashboard for revision.', accent: 'amber' },
            ].map((feat, i) => {
              const colors: Record<string, string> = {
                brand: 'bg-brand-50 text-brand-600 border-brand-100',
                amber: 'bg-amber-50 text-amber-600 border-amber-100',
                violet: 'bg-violet-50 text-violet-600 border-violet-100',
                emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                rose: 'bg-rose-50 text-rose-600 border-rose-100',
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  className="card-elevated p-6 group"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colors[feat.accent]}`}>
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[15px] mb-1.5 text-gray-900">{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SIDE-BY-SIDE COMPARISON ─── */}
      <section className="section-padding bg-white border-y border-gray-100">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
                Stop studying blind.<br />
                <span className="text-gray-400">Start studying smart.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Traditional preparation means hoping you covered everything. Setu tells you exactly what you missed, why it matters, and gives you practice questions to fix it immediately.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { label: 'Without Setu', items: ['No idea which topics are weak', 'Generic question banks', 'Feedback only after the exam'], bad: true },
                  { label: 'With Setu', items: ['Precise gap identification', 'Questions targeting YOUR gaps', 'Instant AI feedback on every submission'], bad: false },
                ].map((col, i) => (
                  <div key={i} className={`rounded-xl border p-5 ${col.bad ? 'border-gray-200 bg-gray-50' : 'border-brand-200 bg-brand-50'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${col.bad ? 'text-gray-400' : 'text-brand-600'}`}>{col.label}</p>
                    <ul className="space-y-2">
                      {col.items.map((item, j) => (
                        <li key={j} className="flex items-center space-x-2 text-sm">
                          {col.bad 
                            ? <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                            : <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                          }
                          <span className={col.bad ? 'text-gray-500' : 'text-gray-700 font-medium'}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link href="/login" className="btn-primary text-sm">
                Try Setu Free <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Right side — evaluation flow illustration */}
            <div className="space-y-4">
              {[
                { step: 'Input', icon: FileText, color: 'border-brand-200 bg-brand-50', preview: '"The Indian Constitution establishes a quasi-federal system with unitary features..."' },
                { step: 'Analysis', icon: Brain, color: 'border-violet-200 bg-violet-50', preview: 'Evaluating depth · Checking factual accuracy · Comparing against UPSC syllabus...' },
                { step: 'Output', icon: Award, color: 'border-emerald-200 bg-emerald-50', preview: 'Score: 72/100 · 3 gaps identified · 10 MCQs generated targeting weak areas' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className={`rounded-xl border p-5 ${s.color}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <s.icon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{s.step}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{s.preview}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUPPORTED DOMAINS ─── */}
      <section className="section-padding bg-warm-50">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Evaluation domains</h2>
            <p className="text-gray-500">Choose your target exam when submitting notes for analysis.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { name: 'Engineering & Technical', exams: 'GATE, JEE Advanced', icon: Settings, status: 'live', color: 'brand' },
              { name: 'Administrative Studies', exams: 'UPSC, State PSC', icon: GraduationCap, status: 'live', color: 'violet' },
              { name: 'Medical Sciences', exams: 'NEET PG, USMLE', icon: Activity, status: 'coming', color: 'emerald' },
              { name: 'Law & Jurisprudence', exams: 'CLAT, Judiciary', icon: Shield, status: 'coming', color: 'amber' },
            ].map((d, i) => {
              const isLive = d.status === 'live';
              return (
                <div key={i} className={`card-elevated p-5 text-center ${!isLive ? 'opacity-60' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl bg-${d.color}-50 text-${d.color}-600 border border-${d.color}-100 flex items-center justify-center mx-auto mb-3`}>
                    <d.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm mb-0.5">{d.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{d.exams}</p>
                  <span className={`badge text-[10px] ${isLive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                    {isLive ? 'Available' : 'Coming Soon'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="section-padding bg-white border-y border-gray-100">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Frequently asked questions</h2>
            <p className="text-gray-500">Everything you need to know about using Setu.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between text-left group">
                  <span className="font-semibold text-gray-900 text-[15px] group-hover:text-brand-600 transition-colors pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-gray-500 text-sm leading-relaxed mt-3 pr-8">
                    {faq.a}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="section-padding bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/15 rounded-full blur-[100px]" />
        <div className="container-main relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
            Start finding your knowledge gaps today.
          </h2>
          <p className="text-gray-400 mb-8 text-base">
            Free to use. No signup friction. Just paste your notes and get instant, actionable feedback from Gemini&nbsp;2.5&nbsp;Flash.
          </p>
          <Link href="/login" className="btn-primary bg-white text-gray-900 hover:bg-gray-100 text-base px-8 py-4">
            Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
        <div className="container-main py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/logo.png" alt="Setu" width={22} height={22} className="rounded brightness-200" />
                <span className="font-bold text-white">Setu</span>
              </div>
              <p className="text-sm leading-relaxed">Academic gap analysis powered by Google Gemini 2.5 Flash.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
            <p>© {new Date().getFullYear()} Setu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
