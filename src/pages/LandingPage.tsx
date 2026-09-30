import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Target, 
  Sparkles, 
  Award, 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Users, 
  HelpCircle, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Calculator,
  Brain,
  Globe,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onStartPreparation: () => void;
  onTakeMockTest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPreparation, onTakeMockTest }) => {
  const { setActivePage } = useApp();

  const subjects = [
    {
      title: 'Quantitative Aptitude',
      desc: '15 Topics: Arithmetic, Algebra, Geometry, Trigonometry, Mensuration & DI shortcuts.',
      icon: Calculator,
      color: 'from-blue-600 to-indigo-600',
      tag: '25 Qs / 50 Marks'
    },
    {
      title: 'General Intelligence & Reasoning',
      desc: '12 Topics: Syllogisms, Coding-Decoding, Non-verbal series, Blood relations.',
      icon: Brain,
      color: 'from-indigo-600 to-purple-600',
      tag: '25 Qs / 50 Marks'
    },
    {
      title: 'English Comprehension',
      desc: '13 Topics: 50 Grammar Rules, Vocab Roots, Idioms, Active-Passive, Cloze Tests.',
      icon: BookOpen,
      color: 'from-sky-500 to-blue-600',
      tag: '25 Qs / 50 Marks'
    },
    {
      title: 'General Awareness',
      desc: '10 Topics: Indian Polity & Articles, Modern History, Geography, Science & Current Affairs.',
      icon: Globe,
      color: 'from-amber-500 to-orange-600',
      tag: '25 Qs / 50 Marks'
    }
  ];

  const features = [
    {
      title: 'NTA / SSC Pattern Mock Simulator',
      desc: 'Identical interface with question palette, sectional timers, negative marking (-0.50), and instant percentile rankings.',
      icon: Award
    },
    {
      title: 'Gemini AI SSC Tutor & Solver',
      desc: 'Step-by-step problem solver, mathematical shortcut tricks, and grammar explanations in clear, concise English.',
      icon: Sparkles
    },
    {
      title: 'Personalized Daily Study Planner',
      desc: 'Dynamic daily study schedules tailored to your target exam date, daily hours, and sectional weaknesses.',
      icon: Clock
    },
    {
      title: 'Deep Performance Analytics',
      desc: 'Weak-area diagnosis, average time per question, accuracy trends, and automated AI study revision plans.',
      icon: BarChart3
    }
  ];

  const testimonials = [
    {
      name: 'Pooja Verma',
      rank: 'AIR 42 · SSC CGL 2023 (Assistant Audit Officer)',
      quote: 'The realistic mock test palette and speed tricks for Quantitative Aptitude helped me boost my Tier-1 score from 135 to 174.5.'
    },
    {
      name: 'Rohan Deshmukh',
      rank: 'AIR 118 · SSC CGL 2023 (GST Inspector)',
      quote: 'The AI Tutor is amazing for clarifying tricky Syllogisms and geometry theorems in under 10 seconds without searching through forums.'
    },
    {
      name: 'Sneha Roy',
      rank: 'Selected · ASO in Central Secretariat Service',
      quote: 'The formula pocket cards and daily current affairs quiz saved me hours of manual note-making.'
    }
  ];

  const faqs = [
    {
      q: 'What is the pattern of SSC CGL Tier-1 Examination?',
      a: 'SSC CGL Tier-1 is an online computer-based exam consisting of 100 objective multiple-choice questions across 4 sections (25 questions each): Reasoning, General Awareness, Quantitative Aptitude, and English. Total time is 60 minutes with +2.0 marks for each correct answer and -0.50 marks negative marking for each incorrect answer.'
    },
    {
      q: 'How does the AI Question Generator work?',
      a: 'Powered by Gemini 3.8 Flash, the AI question generator crafts custom examination questions according to SSC syllabus guidelines, complete with 4 options, step-by-step solutions, and exam shortcuts.'
    },
    {
      q: 'Can I practice previous year question papers (PYQs)?',
      a: 'Yes! The portal features curated PYQs from 2021, 2022, 2023, and 2024 Tier-1 and Tier-2 exams with detailed step-by-step English explanations and filterable topic tags.'
    },
    {
      q: 'Is this portal optimized for mobile devices?',
      a: 'Yes, the portal is built with a responsive mobile-first architecture featuring bottom tab navigation, lightweight question cards, and full touch support.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-14 lg:p-16 border border-indigo-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>All-in-One SSC CGL 2026-2027 Preparation Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Prepare Smarter. <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Score Better.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
            Master Quantitative Aptitude, Reasoning, English, and General Awareness with full-length mock tests, 
            interactive practice drills, PYQ analysis, and 24/7 AI-guided problem solving.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartPreparation}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Start Preparation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onTakeMockTest}
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Take Full Mock Test</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-indigo-900/60 text-xs">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">4 Sections</div>
              <div className="text-slate-400 text-[11px] mt-0.5">50+ Core Syllabus Topics</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">100% Free</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Open Aspirant Access</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-sky-400">60 Mins</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Real CGL Exam Engine</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">Gemini 3.8</div>
              <div className="text-slate-400 text-[11px] mt-0.5">AI Doubt Solver & Mentor</div>
            </div>
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
      </section>

      {/* 4 Pillars of SSC CGL */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Complete Syllabus Coverage
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            The Four Pillars of SSC CGL Tier-1
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Structured subject roadmaps with difficulty ratings, formula cheat-sheets, and targeted practice sets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {sub.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {sub.desc}
                  </p>
                </div>

                <button
                  onClick={() => setActivePage('subjects')}
                  className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  <span>Explore Syllabus</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Built for Aspirants
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Real Exam Readiness
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Every feature is calibrated to the exact cognitive demands and strict timing of the SSC CGL test day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Tutor Callout Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 p-8 sm:p-12 text-white border border-indigo-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next-Gen Gemini 3.8 Flash Integration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Stuck on a tricky Quantitative or Syllogism problem?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Ask the AI SSC Tutor anytime. It breaks down complex geometry questions, explains English grammar exceptions, and provides memory shortcuts.
            </p>
          </div>

          <button
            onClick={() => setActivePage('ai-tutor')}
            className="py-3 px-6 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Open AI Tutor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Aspirant Testimonials */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Aspirant Success
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Trusted by Top Rankers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Hear from aspirants who transformed their mock test percentiles and secured central government posts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{t.rank}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Everything You Need To Know
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>SSC CGL Portal</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Empowering Staff Selection Commission Combined Graduate Level aspirants across India with structured learning and AI tools.
            </p>
          </div>

          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2">Examination Sections</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>Quantitative Aptitude</li>
              <li>General Intelligence & Reasoning</li>
              <li>English Language & Comprehension</li>
              <li>General Awareness & Static GK</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2">Practice Tools</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>All-India Full Mock Tests</li>
              <li>AI Question Generator</li>
              <li>Previous Year Papers (2021-2024)</li>
              <li>Formula Pocket Cards</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2">Aspirant Support</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>Daily Study Scheduler</li>
              <li>Performance Diagnostic Engine</li>
              <li>AI 24/7 Doubt Resolver</li>
              <li>National Leaderboard</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 SSC CGL Preparation Portal. Built for competitive exam aspirants.</p>
          <p>Affiliated with standard SSC CGL syllabus guidelines.</p>
        </div>
      </footer>

    </div>
  );
};
