import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TestAttemptResult, Question } from '../types';
import { api } from '../services/api';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  RotateCcw, 
  LayoutDashboard, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
  MessageSquare,
  Bot
} from 'lucide-react';

interface QuizResultPageProps {
  result?: TestAttemptResult | null;
}

export const QuizResultPage: React.FC<QuizResultPageProps> = ({ result: propResult }) => {
  const { setActivePage } = useApp();

  const [result, setResult] = useState<TestAttemptResult | null>(propResult || null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeReviewFilter, setActiveReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'unattempted'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    // If not passed via props, retrieve from sessionStorage or fallback to recent attempt
    if (!result) {
      const stored = sessionStorage.getItem('last_test_result');
      if (stored) {
        try {
          setResult(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse cached test result');
        }
      } else {
        // Fetch most recent attempt
        api.getTestAttempts().then(attempts => {
          if (attempts.length > 0) {
            setResult(attempts[0]);
          }
        });
      }
    }
  }, [result]);

  // Load question definitions for full solution walkthrough
  useEffect(() => {
    if (result) {
      api.getMockTestById(result.testId).then(detailed => {
        setQuestions(detailed.questions);
      }).catch(() => {
        // Fallback: fetch questions list
        api.getQuestions().then(qs => setQuestions(qs));
      });
    }
  }, [result]);

  if (!result) {
    return (
      <div className="py-24 text-center text-[#64748B] text-xs space-y-3">
        <p>No test results available to display.</p>
        <button
          onClick={() => setActivePage('mock-tests')}
          className="px-4 py-2 rounded-md bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
        >
          Go to Mock Tests
        </button>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.maxScore) * 1000) / 10;
  const timeTakenMinutes = Math.floor(result.totalTimeSpentSeconds / 60);
  const timeTakenSeconds = result.totalTimeSpentSeconds % 60;

  // Performance evaluation diagnosis
  let performanceMessage = '';
  let performanceColor = 'text-[#16A34A]';

  if (result.score >= 140) {
    performanceMessage = 'Outstanding Performance! You scored comfortably above the expected Tier-1 UR Qualifying Cutoff (138–142 Marks). Your speed and accuracy indicate strong mastery of Quantitative Aptitude and Reasoning. Continue revising Static GK to lock in top post ranks.';
    performanceColor = 'text-[#16A34A]';
  } else if (result.score >= 115) {
    performanceMessage = 'Good Solid Effort. You are approaching the Tier-1 cutoff benchmark. Minimizing negative marks in English and improving calculation speed in Quantitative Aptitude will push your score past 140+.';
    performanceColor = 'text-[#2563EB]';
  } else {
    performanceMessage = 'Needs Systematic Revision. Review incorrect responses below, strengthen core formulas from Study Materials, and practice sectional speed drills before taking your next full mock.';
    performanceColor = 'text-[#F59E0B]';
  }

  // Filter questions for review
  const questionRecords = result.answers.map(ans => {
    const qObj = questions.find(q => q.id === ans.questionId);
    return {
      ...ans,
      questionData: qObj
    };
  });

  const filteredReviewQuestions = questionRecords.filter(item => {
    if (activeReviewFilter === 'correct') return item.isCorrect;
    if (activeReviewFilter === 'wrong') return !item.isCorrect && item.selectedOption !== null;
    if (activeReviewFilter === 'unattempted') return item.selectedOption === null;
    return true;
  });

  const handleAskDoubt = (q: Question, item: any) => {
    const subjectName = (
      q.subjectId === 'quantitative-aptitude' ? 'Quantitative Aptitude' :
      q.subjectId === 'reasoning' ? 'Reasoning' :
      q.subjectId === 'english' ? 'English' : 'General Awareness'
    );
    const selectedText = item.selectedOption !== null && item.selectedOption !== undefined
      ? `My Answer: Option ${['A','B','C','D'][item.selectedOption]} (${q.options[item.selectedOption]})`
      : 'I skipped this question.';

    const doubtPayload = {
      question: `I have a doubt on this SSC CGL ${subjectName} question from Mock Test:\n\n"${q.question}"\n\nOptions:\n${q.options.map((opt, i) => `${['A','B','C','D'][i]}. ${opt}`).join('\n')}\n\nCorrect Answer: Option ${['A','B','C','D'][q.correctAnswer]} (${q.options[q.correctAnswer]}).\n${selectedText}\n\nPlease explain step by step why the correct answer is right, where students typically make mistakes, and what is the best speed shortcut trick.`,
      subject: subjectName,
      topic: q.topic
    };

    try {
      sessionStorage.setItem('pending_doubt_question', JSON.stringify(doubtPayload));
    } catch {
      // ignore
    }
    setActivePage('ai-tutor');
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#2563EB]">
            Examination Complete · Detailed Scorecard
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-0.5">
            {result.testTitle}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Submitted on {new Date(result.completedAt).toLocaleDateString()} · SSC CGL Tier 1 CBT Evaluation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActivePage('dashboard')}
            className="px-4 py-2 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Return to Dashboard</span>
          </button>

          <button
            onClick={() => setActivePage('mock-tests')}
            className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Take Another Test</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Results Scorecard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Score */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] mb-1">
            Total Score
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums">
            {result.score}
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            out of {result.maxScore} marks
          </div>
        </div>

        {/* Percentage */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] mb-1">
            Percentage
          </div>
          <div className="text-2xl font-bold text-[#2563EB] tabular-nums">
            {percentage}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            UR Cutoff: 70.0%
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] mb-1">
            Accuracy
          </div>
          <div className="text-2xl font-bold text-[#16A34A] tabular-nums">
            {result.accuracyPercentage}%
          </div>
          <div className="text-[11px] text-[#16A34A] font-medium mt-0.5">
            {result.correctAnswers} of {result.attemptedQuestions} correct
          </div>
        </div>

        {/* Correct Answers */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] mb-1">
            Correct Answers
          </div>
          <div className="text-2xl font-bold text-[#16A34A] tabular-nums">
            {result.correctAnswers}
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            +{result.correctAnswers * 2} marks
          </div>
        </div>

        {/* Wrong Answers */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] mb-1">
            Wrong Answers
          </div>
          <div className="text-2xl font-bold text-[#DC2626] tabular-nums">
            {result.wrongAnswers}
          </div>
          <div className="text-[11px] text-[#DC2626] mt-0.5">
            -{result.wrongAnswers * 0.5} negative marks
          </div>
        </div>

        {/* Time Taken */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] mb-1">
            Time Taken
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums">
            {timeTakenMinutes}m {timeTakenSeconds}s
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            60m allowed
          </div>
        </div>

      </div>

      {/* 3. Performance Message & Diagnosis */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <h2 className="text-sm font-bold text-[#0F172A]">
            Performance Analysis & Diagnostic Feedback
          </h2>
        </div>
        <p className="text-xs text-[#0F172A] leading-relaxed">
          {performanceMessage}
        </p>
      </div>

      {/* 4. Section-Wise Breakdown Table */}
      {result.sectionBreakdown && result.sectionBreakdown.length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Subject-Wise Score Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                  <th className="py-2.5 px-3 font-semibold">Subject Section</th>
                  <th className="py-2.5 px-3 font-semibold">Score</th>
                  <th className="py-2.5 px-3 font-semibold">Attempted</th>
                  <th className="py-2.5 px-3 font-semibold">Correct / Wrong</th>
                  <th className="py-2.5 px-3 font-semibold">Accuracy</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {result.sectionBreakdown.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#0F172A]">
                      {sec.subjectName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#0F172A] tabular-nums">{sec.score}</span>
                      <span className="text-[#64748B]"> / {sec.maxScore}</span>
                    </td>
                    <td className="py-3 px-3 tabular-nums text-[#64748B]">
                      {sec.attempted} Qs
                    </td>
                    <td className="py-3 px-3 tabular-nums">
                      <span className="text-[#16A34A] font-medium">{sec.correct}</span> / <span className="text-[#DC2626] font-medium">{sec.wrong}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#16A34A] tabular-nums">
                      {sec.accuracy}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`text-[11px] font-semibold ${
                        sec.score >= 35 ? 'text-[#16A34A]' : sec.score >= 25 ? 'text-[#2563EB]' : 'text-[#F59E0B]'
                      }`}>
                        {sec.score >= 35 ? 'Strong' : sec.score >= 25 ? 'Average' : 'Needs Practice'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Review Answers Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              Review Questions & Step-by-Step Solutions
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Compare your selected option with the verified answer and study shortcuts
            </p>
          </div>

          {/* Filter segment tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveReviewFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeReviewFilter === 'all'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All ({questionRecords.length})
            </button>
            <button
              onClick={() => setActiveReviewFilter('correct')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeReviewFilter === 'correct'
                  ? 'bg-white text-[#16A34A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Correct ({result.correctAnswers})
            </button>
            <button
              onClick={() => setActiveReviewFilter('wrong')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeReviewFilter === 'wrong'
                  ? 'bg-white text-[#DC2626] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Wrong ({result.wrongAnswers})
            </button>
            <button
              onClick={() => setActiveReviewFilter('unattempted')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeReviewFilter === 'unattempted'
                  ? 'bg-white text-[#64748B] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Skipped ({result.unattemptedQuestions})
            </button>
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-3">
          {filteredReviewQuestions.map((item, idx) => {
            const q = item.questionData;
            const isExpanded = expandedQuestionId === item.questionId;
            const isAnswered = item.selectedOption !== null && item.selectedOption !== undefined;

            return (
              <div
                key={item.questionId}
                className="border border-[#E2E8F0] rounded-xl overflow-hidden transition-all bg-white"
              >
                {/* Collapsible Question Row */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : item.questionId)}
                  className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      item.isCorrect
                        ? 'bg-[#16A34A] text-white'
                        : isAnswered
                        ? 'bg-[#DC2626] text-white'
                        : 'bg-[#E2E8F0] text-[#64748B]'
                    }`}>
                      {item.isCorrect ? '✓' : isAnswered ? '✗' : '-'}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                        <span>Question {idx + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>{q?.topic || 'General Topic'}</span>
                        <span aria-hidden="true">·</span>
                        <span className={item.isCorrect ? 'text-[#16A34A] font-semibold' : isAnswered ? 'text-[#DC2626] font-semibold' : 'text-[#64748B]'}>
                          {item.isCorrect ? '+2.0 Marks' : isAnswered ? '-0.50 Marks' : '0.0 Marks (Skipped)'}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-[#0F172A] mt-1 line-clamp-2">
                        {q?.question || 'Question content loading...'}
                      </p>
                    </div>
                  </div>

                  <button className="text-[#64748B] hover:text-[#0F172A] shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Detailed Solution */}
                {isExpanded && q && (
                  <div className="p-4 pt-0 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-4 text-xs">
                    
                    {/* All Options list */}
                    <div className="space-y-2 pt-3">
                      <div className="font-semibold text-[#64748B]">Options:</div>
                      {q.options.map((opt, oIdx) => {
                        const isCorrectOption = oIdx === q.correctAnswer;
                        const isSelectedByStudent = item.selectedOption === oIdx;

                        let optClass = 'bg-white border-[#E2E8F0] text-[#0F172A]';
                        if (isCorrectOption) {
                          optClass = 'bg-green-50 border-[#16A34A] text-[#16A34A] font-semibold';
                        } else if (isSelectedByStudent && !item.isCorrect) {
                          optClass = 'bg-red-50 border-[#DC2626] text-[#DC2626] font-semibold';
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optClass}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{['A', 'B', 'C', 'D'][oIdx]}.</span>
                              <span>{opt}</span>
                            </div>
                            
                            {isCorrectOption && (
                              <span className="text-[11px] font-bold text-[#16A34A]">
                                Correct Answer ✓
                              </span>
                            )}
                            {isSelectedByStudent && !isCorrectOption && (
                              <span className="text-[11px] font-bold text-[#DC2626]">
                                Your Choice ✗
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-by-Step Explanation */}
                    <div className="p-3.5 rounded-lg bg-white border border-[#E2E8F0] space-y-1.5">
                      <div className="font-bold text-[#0F172A]">
                        Step-by-Step Solution:
                      </div>
                      <p className="text-xs text-[#0F172A] leading-relaxed whitespace-pre-line">
                        {q.explanation}
                      </p>

                      {q.shortcutTrick && (
                        <div className="mt-2 pt-2 border-t border-[#E2E8F0] text-[11px] text-[#2563EB] font-medium">
                          💡 <span className="font-bold">Shortcut Trick:</span> {q.shortcutTrick}
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">Need deeper explanation or shortcut trick?</span>
                        <button
                          onClick={() => handleAskDoubt(q, item)}
                          className="px-3 py-1.5 rounded-md bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] border border-[#BFDBFE] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Ask AI Doubt Support</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Return to Dashboard Footer CTA */}
      <div className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
        <span className="text-xs text-[#64748B]">
          Want to track your cumulative mock trends and all-India percentile?
        </span>
        <button
          onClick={() => setActivePage('analytics')}
          className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>View Performance Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
