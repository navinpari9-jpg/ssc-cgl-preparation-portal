import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { TestAttemptResult } from '../types';
import { 
  TrendingUp, 
  Award, 
  HelpCircle, 
  Flame, 
  Clock, 
  Target, 
  Sparkles,
  ArrowRight,
  Brain,
  Compass,
  Languages,
  CheckCircle2
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user, setActivePage } = useApp();
  const [attempts, setAttempts] = useState<TestAttemptResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const list = await api.getTestAttempts();
        setAttempts(list);
      } catch (err) {
        console.error('Failed to load attempts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAttempts();
  }, []);

  const overallAccuracy = user?.accuracy || 78.4;
  const testsCompleted = user?.mockTestsCompleted || (attempts.length || 14);
  const questionsAttempted = user?.questionsSolved || 1420;
  const studyStreak = user?.streak || 12;

  // Performance progression graph data
  const graphData = [
    { test: 'Mock 1', score: 112, cutoff: 140 },
    { test: 'Mock 2', score: 124, cutoff: 140 },
    { test: 'Mock 3', score: 119, cutoff: 140 },
    { test: 'Mock 4', score: 135, cutoff: 140 },
    { test: 'Mock 5', score: 142, cutoff: 140 },
    { test: 'Mock 6', score: 139, cutoff: 140 },
    { test: 'Mock 7', score: 148, cutoff: 140 },
    { test: 'Mock 8', score: 154, cutoff: 140 }
  ];

  // Subject-wise progress
  const subjectProgress = [
    {
      subject: 'Quantitative Aptitude',
      accuracy: 81.2,
      topicsCompleted: 21,
      totalTopics: 28,
      progressPct: 75,
      note: 'Strong in Percentage, Ratios & SI/CI. Speed drills recommended for Mensuration.'
    },
    {
      subject: 'General Intelligence & Reasoning',
      accuracy: 91.5,
      topicsCompleted: 19,
      totalTopics: 22,
      progressPct: 86,
      note: 'Exceptional pattern recognition. Syllogism possibility cases require fine-tuning.'
    },
    {
      subject: 'English Language',
      accuracy: 84.0,
      topicsCompleted: 15,
      totalTopics: 20,
      progressPct: 75,
      note: 'High accuracy in Reading Comprehension & Vocab. Revise Subject-Verb Agreement rules.'
    },
    {
      subject: 'General Awareness',
      accuracy: 68.4,
      topicsCompleted: 18,
      totalTopics: 34,
      progressPct: 53,
      note: 'Good score in Modern History. Prioritize Indian Polity articles and current awards.'
    }
  ];

  return (
    <div className="space-y-6 py-2">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#2563EB]">
            Performance Analytics & Diagnostic Scorecard
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-0.5">
            Student Performance Insights
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Comprehensive diagnostic trends, subject progress, and mock test score progression.
          </p>
        </div>

        <button
          onClick={() => setActivePage('mock-tests')}
          className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <span>Take Full Mock Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Key Performance Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Overall Accuracy */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1.5">
            <span className="text-xs font-semibold text-[#64748B]">Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums">
            {overallAccuracy}%
          </div>
          <div className="text-[11px] text-[#16A34A] font-medium mt-1">
            Tier-1 Target: &gt; 80%
          </div>
        </div>

        {/* Tests Completed */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1.5">
            <span className="text-xs font-semibold text-[#64748B]">Tests Completed</span>
            <Award className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums">
            {testsCompleted}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Full Mocks & Sectionals
          </div>
        </div>

        {/* Questions Attempted */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1.5">
            <span className="text-xs font-semibold text-[#64748B]">Questions Attempted</span>
            <HelpCircle className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums">
            {questionsAttempted.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            1,180 verified correct
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1.5">
            <span className="text-xs font-semibold text-[#64748B]">Study Streak</span>
            <Flame className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums">
            {studyStreak} <span className="text-xs font-normal text-[#64748B]">days</span>
          </div>
          <div className="text-[11px] text-[#F59E0B] font-medium mt-1">
            Daily practice maintained
          </div>
        </div>

      </div>

      {/* 3. Performance Graph (Interactive SVG Line & Area Chart) */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">
              Mock Test Score Performance Graph
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Score trajectory across consecutive full tests plotted against expected qualifying cutoffs
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span className="font-medium text-[#0F172A]">Aspirant Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span>UR Expected Cutoff (140)</span>
            </div>
          </div>
        </div>

        {/* SVG Graph Canvas */}
        <div className="h-64 w-full pt-4">
          <svg className="w-full h-full" viewBox="0 0 700 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            <line x1="40" y1="20" x2="680" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="65" x2="680" y2="65" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="110" x2="680" y2="110" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="155" x2="680" y2="155" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="200" x2="680" y2="200" stroke="#E2E8F0" strokeWidth="1" />

            {/* Y axis numbers */}
            <text x="32" y="24" textAnchor="end" className="text-[10px] fill-[#64748B]">180</text>
            <text x="32" y="69" textAnchor="end" className="text-[10px] fill-[#64748B]">150</text>
            <text x="32" y="114" textAnchor="end" className="text-[10px] fill-[#64748B]">120</text>
            <text x="32" y="159" textAnchor="end" className="text-[10px] fill-[#64748B]">90</text>
            <text x="32" y="204" textAnchor="end" className="text-[10px] fill-[#64748B]">60</text>

            {/* UR Cutoff line at 140 (approx y=80) */}
            <line x1="40" y1="80" x2="680" y2="80" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="670" y="75" textAnchor="end" className="text-[9px] fill-[#F59E0B] font-bold">Cutoff: 140</text>

            {/* Area Fill */}
            <path
              d="M 60 122 L 148 104 L 236 112 L 324 88 L 412 77 L 500 82 L 588 68 L 676 59 L 676 200 L 60 200 Z"
              fill="url(#analyticsGradient)"
            />

            {/* Data line */}
            <path
              d="M 60 122 L 148 104 L 236 112 L 324 88 L 412 77 L 500 82 L 588 68 L 676 59"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points & Values */}
            {[
              { x: 60, y: 122, val: 112 },
              { x: 148, y: 104, val: 124 },
              { x: 236, y: 112, val: 119 },
              { x: 324, y: 88, val: 135 },
              { x: 412, y: 77, val: 142 },
              { x: 500, y: 82, val: 139 },
              { x: 588, y: 68, val: 148 },
              { x: 676, y: 59, val: 154 },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
                <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[10px] font-bold fill-[#0F172A]">
                  {p.val}
                </text>
              </g>
            ))}

            {/* X Labels */}
            {graphData.map((d, i) => (
              <text
                key={i}
                x={60 + i * 88}
                y="214"
                textAnchor="middle"
                className="text-[10px] fill-[#64748B] font-medium"
              >
                {d.test}
              </text>
            ))}
          </svg>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>Net Improvement: +42 marks over 8 weeks · Consistency Rate: 92%</span>
          <span className="font-semibold text-[#16A34A]">Status: Qualified for Tier 1 Benchmark</span>
        </div>
      </div>

      {/* 4. Subject-Wise Progress Breakdown */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#0F172A]">
          Subject-Wise Progress & Accuracy Benchmark
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectProgress.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">{item.subject}</span>
                <span className="text-xs font-bold text-[#2563EB] tabular-nums">{item.accuracy}% Accuracy</span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1">
                  <span>Syllabus Covered: {item.topicsCompleted} of {item.totalTopics} Topics</span>
                  <span className="font-semibold text-[#0F172A] tabular-nums">{item.progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                    style={{ width: `${item.progressPct}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#64748B] leading-relaxed">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recent Test History Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F172A]">
            Recent Test History
          </h2>
          <span className="text-xs text-[#64748B]">Showing verified attempts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                <th className="py-2.5 px-3 font-semibold">Test Name</th>
                <th className="py-2.5 px-3 font-semibold">Score</th>
                <th className="py-2.5 px-3 font-semibold">Accuracy</th>
                <th className="py-2.5 px-3 font-semibold">Attempted</th>
                <th className="py-2.5 px-3 font-semibold">Time Spent</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No mock test attempts recorded yet.
                  </td>
                </tr>
              ) : (
                attempts.map(att => (
                  <tr key={att.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#0F172A]">
                      {att.testTitle}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#0F172A] tabular-nums">{att.score}</span>
                      <span className="text-[#64748B]"> / {att.maxScore}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#16A34A] tabular-nums">
                      {att.accuracyPercentage}%
                    </td>
                    <td className="py-3 px-3 text-[#64748B] tabular-nums">
                      {att.attemptedQuestions} / {att.totalQuestions} Qs
                    </td>
                    <td className="py-3 px-3 text-[#64748B] tabular-nums">
                      {Math.round(att.totalTimeSpentSeconds / 60)} mins
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          sessionStorage.setItem('last_test_result', JSON.stringify(att));
                          setActivePage('quiz-result');
                        }}
                        className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
                      >
                        View Analysis
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
