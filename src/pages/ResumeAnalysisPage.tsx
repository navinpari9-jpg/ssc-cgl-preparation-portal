import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

export const ResumeAnalysisPage: React.FC = () => {
  const { setActivePage } = useApp();

  const sections = [
    { name: 'Contact Information', status: 'optimal', score: 100, feedback: 'Email, phone, LinkedIn, and GitHub links are properly formatted.' },
    { name: 'Professional Summary', status: 'optimal', score: 92, feedback: 'Strong elevator pitch with targeted technical keywords.' },
    { name: 'Work Experience', status: 'optimal', score: 88, feedback: 'Metrics-driven bullet points with quantified business impact.' },
    { name: 'Technical Skills', status: 'optimal', score: 95, feedback: 'Comprehensive categorization (Languages, Frontend, Backend, Cloud).' },
    { name: 'Education & Certifications', status: 'warning', score: 75, feedback: 'Consider adding graduation year or specialized cloud certifications.' },
    { name: 'Formatting & ATS Parseability', status: 'optimal', score: 94, feedback: 'Single column layout without problematic tables or graphics.' }
  ];

  const matchedKeywords = [
    'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker',
    'REST APIs', 'GraphQL', 'CI/CD', 'Git', 'Tailwind CSS', 'Redux', 'System Architecture'
  ];

  const suggestedKeywords = [
    'Kubernetes', 'Microservices Architecture', 'Unit Testing (Jest/Vitest)', 'Redis Caching', 'CloudFormation/Terraform'
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Resume Analysis & Diagnostic
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detailed breakdown of section strength, keyword density, and actionable suggestions to maximize interview callbacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('ats-score')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>View ATS Score</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border border-emerald-200">
            88%
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Overall Strength</div>
            <div className="text-sm font-bold text-slate-900">Highly Competitive</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-200">
            18
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Keywords Matched</div>
            <div className="text-sm font-bold text-slate-900">Target Tech Stack</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xl border border-purple-200">
            94%
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">ATS Parse Rate</div>
            <div className="text-sm font-bold text-slate-900">Clean Header Structure</div>
          </div>
        </div>
      </div>

      {/* Section-by-Section Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Section-by-Section Breakdown</span>
        </h2>

        <div className="divide-y divide-slate-100">
          {sections.map((sec, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{sec.name}</span>
                  {sec.status === 'optimal' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Optimal
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Improvement Opportunity
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{sec.feedback}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${sec.score >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                    style={{ width: `${sec.score}%` }} 
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 w-8 text-right">{sec.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Detected Keywords ({matchedKeywords.length})</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Recommended Additions ({suggestedKeywords.length})</h3>
          </div>
          <p className="text-xs text-slate-500">
            Adding these high-demand keywords could boost your score by up to +12%.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedKeywords.map((kw, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                + {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
