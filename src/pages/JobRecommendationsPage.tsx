import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  CheckCircle2, 
  Search,
  Filter,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const JobRecommendationsPage: React.FC = () => {
  const { setActivePage, showToast } = useApp();
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>(['rec-1']);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const recommendations = [
    {
      id: 'rec-1',
      title: 'Senior Software Engineer (Full Stack)',
      company: 'TechFlow Systems',
      location: 'San Francisco, CA (Remote)',
      type: 'Full-time',
      salary: '$150,000 - $185,000/yr',
      matchScore: 96,
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      description: 'Building next-generation real-time collaboration tools for enterprise clients.'
    },
    {
      id: 'rec-2',
      title: 'Full Stack TypeScript Engineer',
      company: 'Apex Cloud Solutions',
      location: 'New York, NY (Hybrid)',
      type: 'Full-time',
      salary: '$140,000 - $175,000/yr',
      matchScore: 92,
      tags: ['TypeScript', 'React', 'AWS', 'Docker'],
      description: 'Architecting scalable cloud microservices and high-throughput data processing workflows.'
    },
    {
      id: 'rec-3',
      title: 'Frontend Platform Engineer',
      company: 'HyperScale AI',
      location: 'Austin, TX (Remote)',
      type: 'Full-time',
      salary: '$135,000 - $170,000/yr',
      matchScore: 89,
      tags: ['React', 'Tailwind CSS', 'Vite', 'Redux'],
      description: 'Designing intuitive user interfaces and real-time visualization dashboards for AI model monitoring.'
    },
    {
      id: 'rec-4',
      title: 'Staff Application Developer',
      company: 'Global FinTech Corp',
      location: 'Chicago, IL (Hybrid)',
      type: 'Full-time',
      salary: '$160,000 - $200,000/yr',
      matchScore: 88,
      tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'CI/CD'],
      description: 'Leading technical design for core payment processing gateways and audit compliance engines.'
    }
  ];

  const toggleBookmarkJob = (id: string) => {
    if (bookmarkedJobs.includes(id)) {
      setBookmarkedJobs(prev => prev.filter(item => item !== id));
      showToast({ type: 'info', message: 'Job removed from saved list.' });
    } else {
      setBookmarkedJobs(prev => [...prev, id]);
      showToast({ type: 'success', message: 'Job saved to your bookmarks!' });
    }
  };

  const handleApply = (title: string, company: string) => {
    showToast({
      type: 'success',
      title: 'Application Submitted',
      message: `Your application with ATS-optimized resume has been submitted to ${company} for ${title}.`
    });
  };

  const filteredJobs = recommendations.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>AI Job Recommendations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Recommended Jobs For You
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curated opportunities tailored to your uploaded resume's skills, experience, and ATS keyword strength.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('resume-upload')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Update Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, skill (e.g. React, Node.js), or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Showing {filteredJobs.length} recommended openings
          </span>
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isBookmarked = bookmarkedJobs.includes(job.id);
          return (
            <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-blue-300 transition-all space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {job.matchScore}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-slate-900 font-bold">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {job.salary}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 pt-1">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleBookmarkJob(job.id)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors"
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleApply(job.title, job.company)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Easy Apply
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Skills:</span>
                {job.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
