import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw,
  FileCheck,
  Zap,
  Briefcase
} from 'lucide-react';

export const ResumeUploadPage: React.FC = () => {
  const { setActivePage, showToast } = useApp();
  const [fileName, setFileName] = useState<string>('Sample_Resume_Navin.pdf');
  const [isUploaded, setIsUploaded] = useState<boolean>(true);
  const [resumeText, setResumeText] = useState<string>(
    `Navin Kumar
Senior Full-Stack Software Engineer & System Architect
Email: navinpari9@gmail.com | Phone: +1 (555) 019-2834
LinkedIn: linkedin.com/in/navinkumar | GitHub: github.com/navinpari

PROFESSIONAL SUMMARY
Results-driven software engineer with 5+ years of experience architecting high-performance web applications, scalable REST & GraphQL APIs, and cloud services. Proven expertise in React, TypeScript, Node.js, Python, PostgreSQL, and AWS.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
- Frontend: React, Next.js, Redux, Tailwind CSS, Vite
- Backend: Node.js, Express, Fastify, Django, PostgreSQL, Redis
- Cloud & DevOps: Docker, AWS (ECS, S3, RDS), CI/CD, Git

EXPERIENCE
Senior Software Engineer | TechSolutions Inc. (2022 - Present)
- Designed and maintained scalable microservices handling 2M+ daily active requests with 99.99% uptime.
- Led migration of legacy monolithic platform to modern React/Node architecture, improving page load speeds by 42%.
- Integrated automated ATS scoring pipelines and optimized system security adhering to OWASP guidelines.`
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploaded(true);
      showToast({
        type: 'success',
        title: 'Resume Uploaded',
        message: `${file.name} uploaded successfully. Ready for ATS analysis.`
      });
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast({
        type: 'success',
        title: 'Analysis Complete',
        message: 'Your resume has been processed with an 88% ATS compatibility score.'
      });
      setActivePage('ats-score');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Upload className="w-4 h-4" />
            <span>Resume Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Upload & Parse Resume
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload your PDF or DOCX resume to run deep ATS parsing, keyword benchmarking, and job matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('dashboard')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-8 sm:p-12 text-center transition-all bg-blue-50/20">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Drag & Drop your resume here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF, DOCX, or TXT formats (Max size: 10MB)
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>Browse Computer</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Uploaded File Status */}
      {isUploaded && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{fileName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Parsed 480 words • 18 verified skills detected • Clean formatting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing ATS Score...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze ATS Compatibility →</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Live Text Viewer & Quick Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Parsed Resume Text Preview</span>
            </h2>
            <p className="text-xs text-slate-500">
              You can edit or paste raw resume text below to recalculate keyword relevance.
            </p>
          </div>

          <button
            onClick={() => {
              showToast({
                type: 'info',
                title: 'Text Updated',
                message: 'Updated resume text cached for analysis.'
              });
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Save Edits
          </button>
        </div>

        <textarea
          rows={10}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
        />
      </div>
    </div>
  );
};
