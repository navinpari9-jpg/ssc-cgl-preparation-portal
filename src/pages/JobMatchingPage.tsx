import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Check,
  Zap,
  Target
} from 'lucide-react';

export const JobMatchingPage: React.FC = () => {
  const { setActivePage, showToast } = useApp();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  const matches = [
    {
      id: 'job-1',
      title: 'Senior Full Stack Engineer',
      company: 'Stripe Innovations',
      location: 'San Francisco, CA (Remote)',
      salary: '$145,000 - $185,000',
      matchScore: 94,
      matchingSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'REST APIs'],
      missingSkills: ['Kubernetes'],
      badge: 'Exceptional Match'
    },
    {
      id: 'job-2',
      title: 'Lead Frontend Developer',
      company: 'Datadog Platforms',
      location: 'New York, NY (Hybrid)',
      salary: '$150,000 - $190,000',
      matchScore: 91,
      matchingSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Vite', 'CI/CD'],
      missingSkills: ['GraphQL Federation'],
      badge: 'High Match'
    },
    {
      id: 'job-3',
      title: 'Cloud & API Platform Engineer',
      company: 'Scale AI',
      location: 'Seattle, WA (Remote)',
      salary: '$140,000 - $175,000',
      matchScore: 86,
      matchingSkills: ['Python', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      missingSkills: ['Terraform', 'Kafka'],
      badge: 'Strong Match'
    },
    {
      id: 'job-4',
      title: 'Full Stack TypeScript Engineer',
      company: 'Vercel Partner Labs',
      location: 'Austin, TX (Remote)',
      salary: '$135,000 - $170,000',
      matchScore: 89,
      matchingSkills: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'PostgreSQL'],
      missingSkills: ['Edge Middleware'],
      badge: 'High Match'
    }
  ];

  const handleApply = (title: string, company: string) => {
    showToast({
      type: 'success',
      title: 'Application Initiated',
      message: `Your ATS-optimized resume profile has been prepared for ${title} at ${company}.`
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>AI Skill Alignment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Job Matching & Skills Overlap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare your resume keywords against real-time job market requirements to see skill alignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('job-recommendations')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Browse Job Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-600/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Matching Profile: Full Stack & Frontend Software Engineer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on your parsed resume, you match 90%+ requirements for Senior Web and Full Stack roles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            Top 5% Candidate In Range
          </span>
        </div>
      </div>

      {/* Matched Roles List */}
      <div className="space-y-4">
        {matches.map((job) => (
          <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-blue-300 transition-all space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {job.badge}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                  </span>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-black text-blue-600">{job.matchScore}%</div>
                  <div className="text-[10px] font-medium text-slate-400">Match Index</div>
                </div>
                <button
                  onClick={() => handleApply(job.title, job.company)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Quick Apply
                </button>
              </div>
            </div>

            {/* Skills Comparison */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[11px] font-bold text-emerald-700 mb-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Matching Skills in Your Resume ({job.matchingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchingSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-amber-700 mb-1.5 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Skill Gap to Target ({job.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.missingSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
