import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Target, 
  Award, 
  BarChart3, 
  BookOpen, 
  ArrowRight, 
  Users, 
  HelpCircle, 
  Clock, 
  ShieldCheck, 
  Check,
  Brain,
  Globe,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onStartPreparation: () => void;
  onTakeMockTest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPreparation, onTakeMockTest }) => {
  const { setActivePage } = useApp();

  const subjects = [
    {
      id: 'quantitative-aptitude',
      title: 'Quantitative Aptitude',
      topicsCount: 28,
      questionsCount: 1450,
      desc: 'Arithmetic, Algebra, Geometry, Mensuration, Trigonometry, and Data Interpretation shortcuts.'
    },
    {
      id: 'reasoning',
      title: 'General Intelligence & Reasoning',
      topicsCount: 22,
      questionsCount: 1200,
      desc: 'Analogies, Syllogisms, Coding-Decoding, Non-verbal series, and analytical puzzles.'
    },
    {
      id: 'english',
      title: 'English Language',
      topicsCount: 20,
      questionsCount: 1350,
      desc: 'Reading Comprehension, Error Detection, Vocabulary roots, Idioms, and Grammar rules.'
    },
    {
      id: 'general-awareness',
      title: 'General Awareness',
      topicsCount: 34,
      questionsCount: 1800,
      desc: 'Indian Polity & Articles, Modern History, Geography, Economy, Science, and Current Affairs.'
    }
  ];

  const pillarCards = [
    {
      title: 'CBT Examination Engine',
      desc: 'Official examination simulation with question palette, sectional timers, negative marking (-0.50), and percentile ranking.',
      icon: Award
    },
    {
      title: 'Topic-Wise Question Bank',
      desc: 'Over 5,000 verified practice questions with complete step-by-step solutions and mathematical shortcut tricks.',
      icon: HelpCircle
    },
    {
      title: 'Performance Analytics',
      desc: 'Deep diagnostic feedback showing weak area detection, speed per question, and accuracy progression curves.',
      icon: BarChart3
    },
    {
      title: 'Structured Revision Notes',
      desc: 'Curated formula pocket guides, static GK summary sheets, and high-frequency English vocabulary.',
      icon: BookOpen
    }
  ];

  const testimonials = [
    {
      name: 'Pooja Verma',
      post: 'Assistant Section Officer (MEA) · AIR 42, SSC CGL',
      comment: 'The full-length mock tests and authentic negative marking simulation helped me improve my score from 132 to 168.5 in Tier-1.'
    },
    {
      name: 'Rohan Deshmukh',
      post: 'GST Inspector · AIR 118, SSC CGL',
      comment: 'The topic-wise practice sets and shortcut tricks for Quantitative Aptitude eliminated my calculation bottlenecks.'
    },
    {
      name: 'Sneha Roy',
      post: 'Income Tax Inspector · Selected 2024',
      comment: 'The revision notes and instant solution reviews made my daily study routine structured and highly consistent.'
    }
  ];

  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      
      {/* 1. Hero Section: Clean, restrained, authoritative EdTech visual style */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 shadow-xs">
        <div className="max-w-3xl space-y-5">
          
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
            <span>Staff Selection Commission</span>
            <span aria-hidden="true">·</span>
            <span>SSC CGL 2026-2027 Examination</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight text-balance">
            The Comprehensive Preparation Platform for SSC CGL Aspirants
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-2xl">
            Master Quantitative Aptitude, Reasoning, English, and General Awareness through authentic CBT computer-based mock tests, verified question banks, and detailed performance analytics.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Go to Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('mock-tests')}
              className="px-6 py-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#2563EB]" />
              <span>Take Free Mock Test</span>
            </button>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B]">
            <div>
              <span className="font-bold text-[#0F172A] tabular-nums">5,000+</span> Practice Questions
            </div>
            <span aria-hidden="true" className="text-[#E2E8F0]">|</span>
            <div>
              <span className="font-bold text-[#0F172A] tabular-nums">100 Qs / 60 Mins</span> Real CBT Pattern
            </div>
            <span aria-hidden="true" className="text-[#E2E8F0]">|</span>
            <div>
              <span className="font-bold text-[#16A34A]">Verified</span> Step-by-Step Solutions
            </div>
          </div>

        </div>
      </section>

      {/* 2. Four Core Subjects Breakdown */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-[#2563EB]">Complete Curriculum Coverage</div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-1">
              Tier-1 & Tier-2 Subject Modules
            </h2>
          </div>

          <button
            onClick={() => setActivePage('subjects')}
            className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
          >
            Explore Full Syllabus →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map(s => (
            <div
              key={s.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-[#2563EB]/60 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] mb-2">
                  <span>{s.topicsCount} Topics</span>
                  <span>{s.questionsCount} Qs</span>
                </div>

                <h3 className="font-bold text-sm text-[#0F172A]">
                  {s.title}
                </h3>

                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                <button
                  onClick={() => setActivePage('subjects')}
                  className="w-full py-1.5 rounded-md bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-[#E2E8F0]"
                >
                  <span>View Topics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Platform Capabilities */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-[#2563EB]">Engineered for Preparation</div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-1">
            Built Strictly for Exam Success
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Every feature designed to eliminate exam friction, improve accuracy, and accelerate mental calculation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillarCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-2.5"
              >
                <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {card.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Social Proof & Candidate Outcomes */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-semibold text-[#2563EB]">Aspirant Success Stories</div>
          <h2 className="text-xl font-bold text-[#0F172A] mt-1">
            Recommended by Selected Officers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between"
            >
              <p className="text-xs text-[#0F172A] leading-relaxed italic">
                "{t.comment}"
              </p>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                <div className="font-bold text-xs text-[#0F172A]">{t.name}</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">{t.post}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Final Call to Action */}
      <section className="bg-[#0F172A] rounded-2xl p-8 sm:p-12 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight">
            Begin Your SSC CGL Preparation Today
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Take a diagnostic mock test, discover your current section-wise accuracy, and receive a customized study schedule.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActivePage('register')}
            className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            Create Free Account
          </button>
          <button
            onClick={() => setActivePage('login')}
            className="px-5 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Student Login
          </button>
        </div>
      </section>

      {/* 6. Portal Footer */}
      <footer className="pt-8 pb-12 border-t border-slate-200 mt-12 text-slate-500 text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-800">SSC CGL Examination Preparation Portal</span>
            <span className="text-[11px] text-slate-400">· Comprehensive Tier-1 & Tier-2 Suite</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button onClick={() => setActivePage('subjects')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Syllabus
            </button>
            <button onClick={() => setActivePage('practice')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Practice Bank
            </button>
            <button onClick={() => setActivePage('mock-tests')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Mock Tests
            </button>
            <button onClick={() => setActivePage('study-materials')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Revision Notes
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026 SSC CGL Portal. All exam patterns conform to official staff selection standards.</p>
          <div className="flex items-center gap-3">
            <span>Encrypted Token Verification</span>
            <span>·</span>
            <span>Firebase Auth Protected</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
