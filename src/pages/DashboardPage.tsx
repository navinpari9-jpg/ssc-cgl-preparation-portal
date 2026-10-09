import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { 
  Flame, 
  Target, 
  Award, 
  TrendingUp, 
  Play, 
  BookOpen, 
  ArrowRight,
  Brain,
  Compass,
  CheckCircle2,
  Calendar,
  Zap,
  Calculator,
  Languages,
  CheckSquare,
  Clock,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Sparkles,
  BarChart2,
  AlertCircle,
  Upload,
  FileText,
  Briefcase
} from 'lucide-react';
import { TestAttemptResult, DailyStudyPlan, SubjectMetadata } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, setActivePage, setActiveSubjectFilter, showToast } = useApp();
  const [recentAttempts, setRecentAttempts] = useState<TestAttemptResult[]>([]);
  const [studyPlan, setStudyPlan] = useState<DailyStudyPlan | null>(null);
  const [subjects, setSubjects] = useState<SubjectMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [attempts, plan, subs] = await Promise.all([
          api.getTestAttempts(),
          api.getStudyPlan(),
          api.getSubjects()
        ]);
        setRecentAttempts(attempts);
        setStudyPlan(plan);
        setSubjects(subs);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const displayName = user?.name || currentUser.name;
  const displayStreak = user?.streak || 5;
  const displayQuestionsSolved = user?.questionsSolved || 1420;
  const displayCorrectCount = user?.correctCount || 1108;
  const displayAccuracy = user?.accuracy || 78;
  const displayMockTests = user?.mockTestsCompleted || 14;
  const pendingMockTests = 18;

  // Study progress percentage
  const studyProgress = 68;

  // Mock performance trajectory points for SVG chart
  const performanceTrend = [
    { label: 'Mock 1', score: 112, cutoff: 140 },
    { label: 'Mock 2', score: 124, cutoff: 140 },
    { label: 'Mock 3', score: 119, cutoff: 140 },
    { label: 'Mock 4', score: 135, cutoff: 140 },
    { label: 'Mock 5', score: 142, cutoff: 140 },
    { label: 'Mock 6', score: 139, cutoff: 140 },
    { label: 'Mock 7', score: 148, cutoff: 140 },
  ];

  // Subject categories with subtle accents (Orange, Purple, Cyan, Green)
  const subjectCards = [
    {
      id: 'quantitative-aptitude',
      name: 'Quantitative Aptitude',
      category: 'Mathematics & Data Interpretation',
      icon: Calculator,
      topicsCount: 18,
      questionsCount: 850,
      progress: 72,
      accentColor: 'orange',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-500 text-white',
      barColor: 'bg-amber-500',
      borderHover: 'hover:border-amber-300'
    },
    {
      id: 'reasoning',
      name: 'General Intelligence & Reasoning',
      category: 'Verbal & Non-Verbal Logic',
      icon: Brain,
      topicsCount: 15,
      questionsCount: 720,
      progress: 80,
      accentColor: 'purple',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-600 text-white',
      barColor: 'bg-purple-600',
      borderHover: 'hover:border-purple-300'
    },
    {
      id: 'english',
      name: 'English Language & Comprehension',
      category: 'Grammar, Vocab & Reading Passages',
      icon: Languages,
      topicsCount: 16,
      questionsCount: 940,
      progress: 64,
      accentColor: 'cyan',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      iconBg: 'bg-sky-600 text-white',
      barColor: 'bg-sky-500',
      borderHover: 'hover:border-sky-300'
    },
    {
      id: 'general-awareness',
      name: 'General Awareness',
      category: 'History, Polity, Science & Current Affairs',
      icon: Compass,
      topicsCount: 22,
      questionsCount: 1100,
      progress: 58,
      accentColor: 'green',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      barColor: 'bg-emerald-500',
      borderHover: 'hover:border-emerald-300'
    }
  ];

  // Continue Learning topic definition
  const continueLearningTopic = {
    subject: 'Quantitative Aptitude',
    topic: 'Arithmetic: Time, Speed & Distance (Relative Speed & Trains)',
    progress: 65,
    questionsCompleted: 26,
    totalQuestions: 40,
    estimatedMinutes: 18,
    subjectId: 'quantitative-aptitude'
  };

  const handleStartSubject = (subjectId: string) => {
    setActiveSubjectFilter(subjectId);
    setActivePage('subjects');
  };

  return (
    <div className="space-y-8 py-2">
      
      {/* 1. TOP HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white border border-slate-800 shadow-md">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative px-6 py-8 sm:px-8 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left Text & CTA */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              AI Resume Analyzer & Job Recommendation System
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Welcome back, {displayName}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-blue-200">
                Optimize Your Resume & Accelerate Your Career
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Upload resumes, analyze real-time ATS compatibility, and match with verified job openings.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActivePage('resume-upload')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:translate-y-[-1px] cursor-pointer flex items-center gap-2 group"
              >
                <Upload className="w-4 h-4" />
                <span>Upload & Analyze Resume</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setActivePage('ats-score')}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>ATS Score (88%)</span>
              </button>

              <button
                onClick={() => setActivePage('job-recommendations')}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>View Matched Jobs</span>
              </button>
            </div>
          </div>

          {/* Right Exam Visual Illustration */}
          <div className="lg:w-80 shrink-0 flex justify-center">
            <div className="relative w-72 h-52 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 p-5 shadow-2xl flex flex-col justify-between">
              
              {/* Badge row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    CGL
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Tier-I CBT</div>
                    <div className="text-[10px] text-slate-400">100 Qs · 200 Marks</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Target 165+
                </span>
              </div>

              {/* Central Target Meter Graphic */}
              <div className="my-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-around text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Cutoff (UR)</div>
                  <div className="text-sm font-bold text-slate-200">~142.5</div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <div className="text-[10px] text-slate-400">Your Average</div>
                  <div className="text-sm font-bold text-emerald-400">148.0</div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <div className="text-[10px] text-slate-400">Accuracy</div>
                  <div className="text-sm font-bold text-blue-400">{displayAccuracy}%</div>
                </div>
              </div>

              {/* Bottom exam countdown */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-blue-300 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Estimated Exam: Sep 2025
                </span>
                <span className="text-amber-400 font-semibold">Tier 1 & 2 Focus</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. FOUR STATISTICS CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Stat 1: Study Progress with Circular Progress Indicator */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Study Progress
            </span>
            <div className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {studyProgress}%
            </div>
            <p className="text-[11px] text-[#64748B]">
              48 of 71 topics completed
            </p>
          </div>

          {/* Circular progress SVG */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 transition-all duration-1000 ease-out"
                strokeDasharray={`${studyProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-[#0F172A]">
              {studyProgress}%
            </span>
          </div>
        </div>

        {/* Stat 2: Mock Tests */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Mock Tests
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#0F172A] tracking-tight">
                {displayMockTests}
              </span>
              <span className="text-xs text-[#64748B] font-medium">Attempted</span>
            </div>
            <p className="text-[11px] text-blue-600 font-semibold">
              {pendingMockTests} Pending / Available
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Questions Practiced */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Questions Practiced
            </span>
            <div className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {displayQuestionsSolved.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{displayCorrectCount.toLocaleString()} Correct Answers</span>
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4: Overall Accuracy */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Overall Accuracy
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#0F172A] tracking-tight">
                {displayAccuracy}%
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                +4.2%
              </span>
            </div>
            <div className="text-[11px] text-[#64748B] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>High Performance Band</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </section>

      {/* 3. CONTINUE LEARNING SECTION */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Resume Studying</span>
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] mt-0.5">
              Continue Learning
            </h2>
          </div>
          
          <button
            onClick={() => setActivePage('daily-planner')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View Full Study Schedule</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-5 p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                {continueLearningTopic.subject}
              </span>
              <span className="text-xs text-[#64748B]">
                Module 4 of 6 · Arithmetic Special
              </span>
            </div>

            <h3 className="text-base font-bold text-[#0F172A]">
              {continueLearningTopic.topic}
            </h3>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Progress: {continueLearningTopic.questionsCompleted}/{continueLearningTopic.totalQuestions} Questions solved</span>
                <span className="font-semibold text-[#0F172A]">{continueLearningTopic.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${continueLearningTopic.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
            <div className="text-left sm:text-right">
              <div className="text-xs text-[#64748B]">Est. Remaining</div>
              <div className="text-sm font-bold text-[#0F172A] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{continueLearningTopic.estimatedMinutes} minutes</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveSubjectFilter('quantitative-aptitude');
                setActivePage('practice');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-1.5"
            >
              <span>Resume Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FOUR SUBJECT CARDS (Orange, Purple, Cyan, Green) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
              SSC CGL Syllabus Subjects
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Complete Tier 1 & Tier 2 exam blueprint coverage
            </p>
          </div>

          <button
            onClick={() => setActivePage('subjects')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>All 4 Subjects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectCards.map(sub => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.id}
                className={`p-5 rounded-2xl bg-white border border-[#E2E8F0] ${sub.borderHover} hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${sub.iconBg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sub.badgeBg}`}>
                      Tier 1 & Tier 2
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      {sub.name}
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {sub.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                    <span>{sub.topicsCount} Topics</span>
                    <span>{sub.questionsCount} Qs</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${sub.barColor} rounded-full`}
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">{sub.progress}% completed</span>
                  <button
                    onClick={() => handleStartSubject(sub.id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4.5. STUDY LIBRARY & PERSONALIZED RECOMMENDATIONS SECTION */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Digital Study Library</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mt-0.5 tracking-tight">
              Study Library & Formula Vault
            </h2>
          </div>

          <button
            onClick={() => setActivePage('study-materials')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore Full 140+ Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Library Inventory Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div 
            onClick={() => setActivePage('study-materials')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-colors text-center cursor-pointer group"
          >
            <div className="text-xl font-black text-[#0F172A] group-hover:text-blue-600">98</div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Topic Notes</div>
          </div>
          <div 
            onClick={() => setActivePage('study-materials')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-colors text-center cursor-pointer group"
          >
            <div className="text-xl font-black text-[#0F172A] group-hover:text-blue-600">46</div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">PDF Books</div>
          </div>
          <div 
            onClick={() => setActivePage('study-materials')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-colors text-center cursor-pointer group"
          >
            <div className="text-xl font-black text-[#0F172A] group-hover:text-blue-600">14</div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Formula Sheets</div>
          </div>
          <div 
            onClick={() => setActivePage('study-materials')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-colors text-center cursor-pointer group"
          >
            <div className="text-xl font-black text-[#0F172A] group-hover:text-blue-600">35</div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Practice Sets</div>
          </div>
          <div 
            onClick={() => setActivePage('study-materials')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-colors text-center cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="text-xl font-black text-[#0F172A] group-hover:text-blue-600">20+</div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">PYQ Digest</div>
          </div>
        </div>

        {/* Personalized Recommendations & Popular Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          
          {/* Personalized Recommendation Card (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Personalized Recommendations
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                AI Diagnostic
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-blue-950">
                Based on your recent mock test performance, revise Algebra and Time & Work.
              </h3>
              <p className="text-xs text-blue-800/80 mt-1 leading-relaxed">
                Improving your accuracy in algebraic identities and work-efficiency ratios will push your Tier-1 score past 155+.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { title: 'Algebra Complete Notes & Formula Sheet', type: 'Formula Sheet', time: '18 min read', subId: 'quantitative-aptitude' },
                { title: 'Time & Work Shortcuts & 25 Solved PYQs', type: 'Topic Notes', time: '16 min read', subId: 'quantitative-aptitude' },
                { title: '120 Golden Rules of English Grammar', type: 'Revision Capsule', time: '24 min read', subId: 'english' }
              ].map((rec, i) => (
                <div 
                  key={i}
                  onClick={() => setActivePage('study-materials')}
                  className="p-3 rounded-lg bg-white border border-blue-200 hover:border-blue-400 transition-colors flex items-center justify-between cursor-pointer group shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors truncate">
                      {rec.title}
                    </div>
                    <div className="text-[10px] text-[#64748B] flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-blue-600">{rec.type}</span>
                      <span>•</span>
                      <span>{rec.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Popular Study Materials & Continue Reading (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Popular Downloads</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Tier-1 & 2</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { title: 'Complete Quant Master Formula Book', pages: '56 Pages', dls: '8.9k downloads' },
                  { title: 'SSC CGL 2024 Tier-1 All Shifts Solved', pages: '120 Pages', dls: '16.7k downloads' },
                  { title: '1000 High-Yield Static GK Pocketbook', pages: '60 Pages', dls: '14.8k downloads' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePage('study-materials')}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1">
                      <span>{item.pages}</span>
                      <span className="font-medium text-emerald-600">{item.dls}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActivePage('study-materials')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Open PDF Study Library →
            </button>
          </div>

        </div>
      </section>

      {/* 5. PERFORMANCE CHART & RECENT TEST RESULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Performance Trend Chart (7 cols on lg) */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Score Trajectory
              </div>
              <h2 className="text-base font-bold text-[#0F172A] mt-0.5">
                Mock Test Score vs Qualifying Cutoff
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#64748B]">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Your Score</span>
              </span>
              <span className="flex items-center gap-1 text-[#64748B]">
                <span className="w-2.5 h-0.5 bg-rose-500" />
                <span>Cutoff (140)</span>
              </span>
            </div>
          </div>

          {/* SVG Score Line Chart */}
          <div className="py-4">
            <div className="relative h-56 w-full flex items-end pt-6 pb-4">
              
              {/* Cutoff Threshold Dashed Line (at 140 marks out of 200, ~70% height) */}
              <div 
                className="absolute w-full border-b border-dashed border-rose-400 z-10 flex items-center justify-between text-[10px] text-rose-500 font-bold px-2 pointer-events-none"
                style={{ bottom: '55%' }}
              >
                <span>Target Cutoff: 140</span>
                <span>UR Benchmark</span>
              </div>

              {/* Data points and bars */}
              <div className="w-full h-full flex items-end justify-between gap-2 px-2 z-20">
                {performanceTrend.map((item, idx) => {
                  const heightPercent = (item.score / 200) * 100;
                  const isAboveCutoff = item.score >= item.cutoff;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      {/* Tooltip / value */}
                      <span className="text-[11px] font-bold text-[#0F172A] opacity-80 group-hover:opacity-100 transition-opacity">
                        {item.score}
                      </span>

                      {/* Bar indicator */}
                      <div className="w-full max-w-[32px] h-36 bg-slate-100 rounded-t-lg flex items-end p-0.5 overflow-hidden">
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            isAboveCutoff 
                              ? 'bg-blue-600 group-hover:bg-blue-500' 
                              : 'bg-slate-400 group-hover:bg-slate-500'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      {/* Label */}
                      <span className="text-[11px] text-[#64748B] font-medium truncate">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Insight footer */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <span className="font-semibold">
                Latest Tier 1 Mock: 148 / 200 marks (+8 above expected cutoff)
              </span>
              <button
                onClick={() => setActivePage('analytics')}
                className="font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer"
              >
                Full Analytics
              </button>
            </div>
          </div>
        </section>

        {/* Recent Test Results (5 cols on lg) */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Test History
                </div>
                <h2 className="text-base font-bold text-[#0F172A] mt-0.5">
                  Recent Test Results
                </h2>
              </div>
              <button
                onClick={() => setActivePage('mock-tests')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* List of recent attempts */}
            <div className="divide-y divide-slate-100 mt-2">
              {recentAttempts.length > 0 ? (
                recentAttempts.slice(0, 4).map(attempt => (
                  <div key={attempt.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#0F172A] truncate">
                        {attempt.testTitle}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                        <span>{new Date(attempt.completedAt || attempt.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <span>·</span>
                        <span className="font-medium text-emerald-600">{attempt.accuracyPercentage}% Acc</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold text-[#0F172A]">
                        {attempt.score} <span className="text-[10px] text-[#64748B] font-normal">/ {attempt.maxScore}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-600">
                        Qualified
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                // Clean curated fallback attempts
                [
                  { name: 'Full Mock Test #04 (Tier-1)', date: 'Yesterday', score: '148.0', max: '200', acc: '82%', rank: '94.6%ile' },
                  { name: 'Quantitative Speed Drill #2', date: '2 days ago', score: '44.0', max: '50', acc: '88%', rank: '96.2%ile' },
                  { name: 'Reasoning Sectional Test #3', date: '3 days ago', score: '46.5', max: '50', acc: '93%', rank: '98.1%ile' },
                  { name: 'English Cloze & Vocab Test', date: '5 days ago', score: '38.0', max: '50', acc: '76%', rank: '89.4%ile' }
                ].map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#0F172A] truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                        <span>{item.date}</span>
                        <span>·</span>
                        <span className="font-semibold text-emerald-600">{item.acc} Acc</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold text-[#0F172A]">
                        {item.score} <span className="text-[10px] text-[#64748B] font-normal">/ {item.max}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-600">
                        {item.rank}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setActivePage('mock-tests')}
              className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Take Another Full Mock Test →
            </button>
          </div>
        </section>

      </div>

      {/* 6. QUICK ACTIONS */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#0F172A]">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Take Mock Test */}
          <button
            onClick={() => setActivePage('mock-tests')}
            className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-blue-300 hover:shadow-md transition-all text-left group cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                Take Mock Test
              </div>
              <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                Full CBT Tier-I Exam
              </div>
            </div>
          </button>

          {/* Action 2: Practice Daily Quiz */}
          <button
            onClick={() => setActivePage('practice')}
            className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-emerald-300 hover:shadow-md transition-all text-left group cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0F172A] group-hover:text-emerald-600 transition-colors">
                Practice Daily Quiz
              </div>
              <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                15 Rapid mixed questions
              </div>
            </div>
          </button>

          {/* Action 3: Resume Study Plan */}
          <button
            onClick={() => setActivePage('daily-planner')}
            className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0F172A] group-hover:text-purple-600 transition-colors">
                Resume Study Plan
              </div>
              <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                Today's scheduled targets
              </div>
            </div>
          </button>

          {/* Action 4: Ask AI Tutor / Doubt Support */}
          <button
            onClick={() => setActivePage('ai-tutor')}
            className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-amber-300 hover:shadow-md transition-all text-left group cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0F172A] group-hover:text-amber-600 transition-colors">
                Ask Doubt Support
              </div>
              <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                Instant solution helper
              </div>
            </div>
          </button>

        </div>
      </section>

    </div>
  );
};
