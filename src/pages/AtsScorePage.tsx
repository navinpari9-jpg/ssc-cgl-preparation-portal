import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  Sparkles,
  FileText,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const AtsScorePage: React.FC = () => {
  const { setActivePage } = useApp();

  const metrics = [
    { title: 'Keyword Relevance', score: 92, desc: '92% of target developer job description keywords found' },
    { title: 'Format & Parseability', score: 95, desc: 'Clean single-column structure parsed flawlessly by ATS engines' },
    { title: 'Action Verbs & Impact', score: 84, desc: 'Strong action verbs with quantifiable metrics included' },
    { title: 'Skill Completeness', score: 82, desc: 'Core programming languages and frameworks clearly listed' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Compatibility Index</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Applicant Tracking System (ATS) Score
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time evaluation against industry standard ATS algorithms (Workday, Greenhouse, Taleo, Lever).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('job-matching')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Explore Matched Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Score Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top Tier Candidate Profile</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your ATS Match Score is 88 / 100
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your resume passes 94% of automated screen filters. Candidates with scores above 85 receive 3.4x more interview invitations.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => setActivePage('resume-analysis')}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Review Full Breakdown
            </button>
            <button
              onClick={() => setActivePage('job-recommendations')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Recommended Roles →
            </button>
          </div>
        </div>

        {/* Circular Gauge Representation */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#334155"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 * (1 - 0.88)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black text-white tracking-tight">88</span>
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">Out of 100</span>
          </div>
        </div>
      </div>

      {/* Sub-Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">{m.title}</span>
              <span className="text-sm font-extrabold text-blue-600">{m.score}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${m.score}%` }} 
              />
            </div>
            <p className="text-xs text-slate-500 pt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Recommended Quick Fixes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Quick Actions to Reach 95%+ ATS Score</span>
        </h3>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Add AWS & Docker Certifications:</span>
              <span className="text-slate-600 ml-1">Mention specific cloud credentials (e.g. AWS Certified Solutions Architect) in the Education section.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Quantify Performance Optimization:</span>
              <span className="text-slate-600 ml-1">In your previous role, specify how much latency dropped or how many concurrent requests were supported.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
