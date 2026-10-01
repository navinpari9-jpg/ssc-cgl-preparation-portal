import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MockTest, TestAttemptResult } from '../types';
import { QuizQuestionPage } from './QuizQuestionPage';
import { QuizResultPage } from './QuizResultPage';
import { 
  Award, 
  Clock, 
  HelpCircle, 
  TrendingUp, 
  Play, 
  Filter, 
  Layers, 
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const MockTestsPage: React.FC = () => {
  const { setActivePage, showToast } = useApp();

  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'full-tier1' | 'subject' | 'pyq'>('all');

  // Test execution state
  const [activeRunningTestId, setActiveRunningTestId] = useState<string | null>(null);
  const [completedResult, setCompletedResult] = useState<TestAttemptResult | null>(null);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const tests = await api.getMockTests();
        setMockTests(tests);
      } catch (err) {
        console.error('Failed to load mock tests:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, []);

  const handleStartTest = (testId: string) => {
    setActiveRunningTestId(testId);
    setCompletedResult(null);
  };

  const handleTestFinished = (result: TestAttemptResult) => {
    setActiveRunningTestId(null);
    setCompletedResult(result);
  };

  // If user is currently running a test, render the QuizQuestionPage
  if (activeRunningTestId) {
    return (
      <QuizQuestionPage
        testId={activeRunningTestId}
        onFinishTest={handleTestFinished}
      />
    );
  }

  // If test just completed, render the QuizResultPage
  if (completedResult) {
    return (
      <QuizResultPage
        result={completedResult}
      />
    );
  }

  const filteredTests = mockTests.filter(t => {
    if (selectedFilter === 'all') return true;
    return t.type === selectedFilter;
  });

  return (
    <div className="space-y-6 py-2">
      
      {/* 1. Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#2563EB]">
            CBT Computer Based Test Series · SSC CGL 2026
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-0.5">
            Mock Test Series Hub
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Official simulation of SSC CGL Tier-1 (100 Qs · 60 mins · 200 marks · -0.50 negative marking).
          </p>
        </div>

        {/* Quick launch into first full mock */}
        {mockTests.length > 0 && (
          <button
            onClick={() => handleStartTest(mockTests[0].id)}
            className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Featured Mock Test</span>
          </button>
        )}
      </div>

      {/* 2. Test Format Banner */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE]/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-[#2563EB] shrink-0" />
          <div>
            <span className="font-bold text-[#0F172A]">Real Examination Marking Scheme:</span>{' '}
            <span className="text-[#64748B]">+2.00 marks for each correct response, -0.50 marks for each wrong response. No penalty for unattempted questions.</span>
          </div>
        </div>

        <button
          onClick={() => setActivePage('analytics')}
          className="text-[#2563EB] font-semibold hover:underline shrink-0 text-left sm:text-right cursor-pointer"
        >
          View Past Test Analysis →
        </button>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-lg w-fit text-xs font-semibold">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          All Tests ({mockTests.length})
        </button>

        <button
          onClick={() => setSelectedFilter('full-tier1')}
          className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
            selectedFilter === 'full-tier1'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Full-Length Tier-1
        </button>

        <button
          onClick={() => setSelectedFilter('subject')}
          className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
            selectedFilter === 'subject'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Sectional Tests
        </button>

        <button
          onClick={() => setSelectedFilter('pyq')}
          className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
            selectedFilter === 'pyq'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Previous Year Papers
        </button>
      </div>

      {/* 4. Mock Tests Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#64748B] text-xs">
          Loading test catalog...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map(test => {
            const isFull = test.type === 'full-tier1';
            return (
              <div
                key={test.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-[#2563EB]/60 transition-colors"
              >
                <div>
                  {/* Top Badge: Type & Difficulty */}
                  <div className="flex items-center justify-between gap-2 mb-2 text-[11px] text-[#64748B]">
                    <span className="font-semibold text-[#2563EB]">
                      {isFull ? 'Full Length Simulation' : test.type === 'pyq' ? 'Previous Year Paper' : 'Sectional Drill'}
                    </span>
                    <span className="tabular-nums">
                      {test.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0F172A] leading-snug">
                    {test.title}
                  </h3>

                  <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                    {test.description}
                  </p>

                  {/* Metadata: Questions, Duration, Marks */}
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-4 pt-3 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-[#64748B]" />
                      <span className="tabular-nums">{test.totalQuestions} Qs</span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                      <span className="tabular-nums">{test.durationMinutes} mins</span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#64748B]" />
                      <span className="tabular-nums">{test.totalMarks} Marks</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#64748B] mt-1.5">
                    {test.attemptCount ? `${test.attemptCount.toLocaleString()} aspirants attempted` : 'Recent test added'}
                  </div>
                </div>

                {/* Start Test CTA */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => handleStartTest(test.id)}
                    className="w-full py-2 px-3 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Examination</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
