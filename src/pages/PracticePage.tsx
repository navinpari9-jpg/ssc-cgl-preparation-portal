import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Question, SubjectId, DifficultyLevel } from '../types';
import { 
  Bookmark, 
  Flag, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  Clock, 
  Filter, 
  Sparkles,
  Bot
} from 'lucide-react';

export const PracticePage: React.FC = () => {
  const { 
    user, 
    activeSubjectFilter, 
    setActiveSubjectFilter, 
    activeTopicFilter, 
    setActiveTopicFilter,
    toggleBookmark, 
    showToast,
    setActivePage 
  } = useApp();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [filterSubject, setFilterSubject] = useState<string>(activeSubjectFilter || 'all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [timedMode, setTimedMode] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Load questions based on filters
  const loadQuestions = async () => {
    setLoading(true);
    try {
      const list = await api.getQuestions({
        subjectId: filterSubject !== 'all' ? filterSubject : undefined,
        topic: activeTopicFilter || undefined,
        difficulty: filterDifficulty !== 'all' ? filterDifficulty : undefined
      });
      setQuestions(list);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowExplanation({});
      setSecondsElapsed(0);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [filterSubject, filterDifficulty, activeTopicFilter]);

  // Timed practice counter
  useEffect(() => {
    let interval: any = null;
    if (timedMode) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timedMode]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined && selectedAnswers[currentIndex] !== null) {
      return; // Already answered
    }
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    setShowExplanation(prev => ({ ...prev, [currentIndex]: true }));

    const isCorrect = optionIndex === currentQ.correctAnswer;
    if (isCorrect) {
      showToast({
        type: 'success',
        title: 'Correct Answer (+2.0)',
        message: 'Great deduction. Check the short trick below.'
      });
    } else {
      showToast({
        type: 'error',
        title: 'Incorrect (-0.50)',
        message: `The correct option was: "${currentQ.options[currentQ.correctAnswer]}".`
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleResetSession = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setSecondsElapsed(0);
    showToast({ type: 'info', message: 'Practice session reset.' });
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'info',
      title: 'Report Received',
      message: 'Thank you! Our academic review team will verify this question.'
    });
    setReportModalOpen(false);
    setReportReason('');
  };

  // Performance calculations for session
  const answeredCount = Object.keys(selectedAnswers).length;
  let correctCount = 0;
  Object.entries(selectedAnswers).forEach(([idxStr, chosen]) => {
    const q = questions[parseInt(idxStr, 10)];
    if (q && chosen === q.correctAnswer) {
      correctCount++;
    }
  });
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const netScore = Math.max(0, Math.round((correctCount * 2.0 - (answeredCount - correctCount) * 0.5) * 10) / 10);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isBookmarked = user?.bookmarkedQuestionIds.includes(currentQ?.id);

  return (
    <div className="space-y-6 py-2 select-none">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#2563EB]">
            Interactive Practice Engine · Verified Solutions
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-0.5">
            Topic-Wise Practice Drill
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Solve questions with instant explanations, mathematical shortcut tricks, and timed practice sessions.
          </p>
        </div>

        <button
          onClick={() => setActivePage('ai-tutor')}
          className="px-4 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-blue-100 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask AI Doubt Solver</span>
        </button>
      </div>

      {/* 2. Controls & Session Strip */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => {
              setFilterSubject(e.target.value);
              setActiveSubjectFilter(e.target.value === 'all' ? undefined : e.target.value);
            }}
            className="py-1.5 px-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Subjects</option>
            <option value="quantitative-aptitude">Quantitative Aptitude</option>
            <option value="reasoning">General Intelligence & Reasoning</option>
            <option value="english">English Language</option>
            <option value="general-awareness">General Awareness</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="py-1.5 px-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Foundational (Easy)</option>
            <option value="Medium">Moderate (Medium)</option>
            <option value="Hard">Advanced (Hard)</option>
          </select>

          {activeTopicFilter && (
            <div className="flex items-center gap-1.5 text-xs text-[#2563EB] font-medium bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#BFDBFE]">
              <span>Topic: {activeTopicFilter}</span>
              <button
                onClick={() => setActiveTopicFilter(undefined)}
                className="hover:text-red-600 font-bold ml-1 cursor-pointer"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Right side controls: Timer & Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTimedMode(!timedMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
              timedMode
                ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="tabular-nums">{timedMode ? `Timed: ${formatTimer(secondsElapsed)}` : 'Enable Timer'}</span>
          </button>

          <button
            onClick={handleResetSession}
            className="p-1.5 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            title="Reset Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 3. Session Score Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] text-center shadow-xs">
          <div className="text-[11px] font-semibold text-[#64748B]">Attempted</div>
          <div className="text-xl font-bold text-[#0F172A] mt-0.5 tabular-nums">
            {answeredCount} / {questions.length}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] text-center shadow-xs">
          <div className="text-[11px] font-semibold text-[#64748B]">Correct</div>
          <div className="text-xl font-bold text-[#16A34A] mt-0.5 tabular-nums">
            {correctCount}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] text-center shadow-xs">
          <div className="text-[11px] font-semibold text-[#64748B]">Accuracy</div>
          <div className="text-xl font-bold text-[#2563EB] mt-0.5 tabular-nums">
            {accuracy}%
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] text-center shadow-xs">
          <div className="text-[11px] font-semibold text-[#64748B]">Net Score</div>
          <div className="text-xl font-bold text-[#0F172A] mt-0.5 tabular-nums">
            {netScore} <span className="text-xs text-[#64748B] font-normal">marks</span>
          </div>
        </div>
      </div>

      {/* 4. Question Card */}
      {loading ? (
        <div className="py-24 text-center text-xs text-[#64748B]">
          Loading practice questions...
        </div>
      ) : questions.length === 0 ? (
        <div className="py-20 text-center p-8 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
          <HelpCircle className="w-8 h-8 mx-auto text-[#64748B]" />
          <h3 className="font-bold text-[#0F172A]">No questions found for this filter</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Try choosing a different topic or select "All Subjects".
          </p>
        </div>
      ) : currentQ ? (
        <div className="space-y-4">
          
          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
            
            {/* Question Top Metadata: Unboxed text with subtle typographic separators */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] text-xs text-[#64748B]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F172A] tabular-nums">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentQ.topic}</span>
                <span aria-hidden="true">·</span>
                <span className={
                  currentQ.difficulty === 'Easy' ? 'text-[#16A34A] font-semibold' :
                  currentQ.difficulty === 'Medium' ? 'text-[#2563EB] font-semibold' :
                  'text-[#DC2626] font-semibold'
                }>
                  {currentQ.difficulty}
                </span>
                {currentQ.pyqExam && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{currentQ.pyqExam}</span>
                  </>
                )}
              </div>

              {/* Actions: Save & Report */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark('question', currentQ.id)}
                  className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-50 border-[#F59E0B] text-[#F59E0B]'
                      : 'border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                  }`}
                  title="Bookmark question"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#F59E0B]' : ''}`} />
                  <span className="text-[11px] font-medium hidden sm:inline">Save</span>
                </button>

                <button
                  onClick={() => setReportModalOpen(true)}
                  className="p-1.5 rounded-md border border-[#E2E8F0] text-[#64748B] hover:text-[#DC2626] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Report question"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden sm:inline">Report</span>
                </button>
              </div>
            </div>

            {/* Question Statement */}
            <div className="text-base font-semibold text-[#0F172A] leading-relaxed">
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-1">
              {currentQ.options.map((optText, oIdx) => {
                const isSelected = selectedAnswers[currentIndex] === oIdx;
                const isAnswered = selectedAnswers[currentIndex] !== undefined && selectedAnswers[currentIndex] !== null;
                const isCorrect = oIdx === currentQ.correctAnswer;

                let optStyle = 'bg-white border-[#E2E8F0] hover:border-[#2563EB]/60 text-[#0F172A]';
                if (isAnswered) {
                  if (isCorrect) {
                    optStyle = 'bg-green-50 border-[#16A34A] text-[#16A34A] font-semibold';
                  } else if (isSelected) {
                    optStyle = 'bg-red-50 border-[#DC2626] text-[#DC2626] font-semibold';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-lg border text-left text-xs transition-colors flex items-start gap-3 cursor-pointer ${optStyle}`}
                  >
                    <span className="font-bold shrink-0 mt-0.5">
                      {['A', 'B', 'C', 'D'][oIdx]}.
                    </span>
                    <span className="leading-relaxed flex-1">
                      {optText}
                    </span>
                    {isAnswered && isCorrect && (
                      <span className="text-[11px] font-bold text-[#16A34A]">✓ Correct</span>
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <span className="text-[11px] font-bold text-[#DC2626]">✗ Selected</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Walkthrough */}
            {showExplanation[currentIndex] && (
              <div className="mt-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                <div className="font-bold text-[#0F172A]">
                  Step-by-Step Solution:
                </div>
                <p className="text-[#0F172A] leading-relaxed whitespace-pre-line">
                  {currentQ.explanation}
                </p>

                {currentQ.shortcutTrick && (
                  <div className="mt-2 pt-2 border-t border-[#E2E8F0] text-[11px] text-[#2563EB] font-medium">
                    💡 <span className="font-bold">Shortcut Trick:</span> {currentQ.shortcutTrick}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3.5 py-1.5 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-[#64748B] tabular-nums">
              {currentIndex + 1} of {questions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="px-3.5 py-1.5 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ) : null}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A]">Report Question Discrepancy</h3>
            <p className="text-xs text-[#64748B]">
              Please describe the issue with this question (incorrect answer, typographical error, ambiguous phrasing).
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-3">
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the discrepancy..."
                rows={3}
                required
                className="w-full p-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
