import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  MockTest, 
  Question, 
  QuestionPaletteStatus, 
  SubjectId, 
  TestAttemptResult 
} from '../types';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  RotateCcw, 
  Save, 
  Send,
  Layers,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

interface QuizQuestionPageProps {
  testId?: string;
  onFinishTest?: (result: TestAttemptResult) => void;
}

export const QuizQuestionPage: React.FC<QuizQuestionPageProps> = ({ 
  testId: propTestId, 
  onFinishTest 
}) => {
  const { setActivePage, showToast } = useApp();

  const [activeTest, setActiveTest] = useState<(MockTest & { questions: Question[] }) | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, QuestionPaletteStatus>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(3600); // 60 mins default
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(true);

  const timerRef = useRef<any>(null);

  // Initialize test data
  useEffect(() => {
    const initTest = async () => {
      try {
        const tests = await api.getMockTests();
        const targetId = propTestId || tests[0]?.id || 'mock-tier1-full-01';
        const detailed = await api.getMockTestById(targetId);
        
        setActiveTest(detailed);
        setTimeRemainingSeconds(detailed.durationMinutes * 60);

        const initialAnswers: Record<string, number | null> = {};
        const initialStatuses: Record<string, QuestionPaletteStatus> = {};
        
        detailed.questions.forEach((q, idx) => {
          initialAnswers[q.id] = null;
          initialStatuses[q.id] = idx === 0 ? 'not-answered' : 'not-visited';
        });

        setAnswers(initialAnswers);
        setQuestionStatuses(initialStatuses);
      } catch (err) {
        showToast({ type: 'error', message: 'Failed to load test questions' });
      } finally {
        setLoading(false);
      }
    };
    initTest();
  }, [propTestId]);

  // Countdown timer
  useEffect(() => {
    if (activeTest && timeRemainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTest]);

  if (loading || !activeTest) {
    return (
      <div className="py-24 text-center text-[#64748B] text-xs">
        Preparing examination environment & loading questions...
      </div>
    );
  }

  const questions = activeTest.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Formatting time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isLowTime = timeRemainingSeconds < 300; // less than 5 minutes

  // Handle option selection
  const handleSelectOption = (optIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optIndex }));
    setQuestionStatuses(prev => ({ ...prev, [currentQuestion.id]: 'answered' }));
  };

  // Clear response
  const handleClearResponse = () => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: null }));
    setQuestionStatuses(prev => ({ ...prev, [currentQuestion.id]: 'not-answered' }));
  };

  // Mark for review & next
  const handleMarkForReview = () => {
    const isAnswered = answers[currentQuestion.id] !== null && answers[currentQuestion.id] !== undefined;
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQuestion.id]: isAnswered ? 'answered-marked-review' : 'marked-review'
    }));
    handleNextQuestion();
  };

  // Save & Next
  const handleSaveAndNext = () => {
    const isAnswered = answers[currentQuestion.id] !== null && answers[currentQuestion.id] !== undefined;
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQuestion.id]: isAnswered ? 'answered' : 'not-answered'
    }));
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      const nextQ = questions[nextIdx];
      if (questionStatuses[nextQ.id] === 'not-visited') {
        setQuestionStatuses(prev => ({ ...prev, [nextQ.id]: 'not-answered' }));
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    setCurrentQuestionIndex(idx);
    const q = questions[idx];
    if (questionStatuses[q.id] === 'not-visited') {
      setQuestionStatuses(prev => ({ ...prev, [q.id]: 'not-answered' }));
    }
  };

  // Summary counts for palette & submission
  const countAnswered = Object.values(answers).filter(a => a !== null && a !== undefined).length;
  const countMarked = Object.values(questionStatuses).filter(s => s === 'marked-review' || s === 'answered-marked-review').length;
  const countNotAnswered = Object.values(questionStatuses).filter(s => s === 'not-answered').length;
  const countNotVisited = Object.values(questionStatuses).filter(s => s === 'not-visited').length;

  // Submit test and create scorecard
  const handleSubmitTest = async () => {
    setShowSubmitModal(false);
    
    // Evaluate test
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let rawScore = 0;

    const answerRecords = questions.map(q => {
      const selected = answers[q.id];
      const isAttempted = selected !== null && selected !== undefined;
      const isCorrect = isAttempted && selected === q.correctAnswer;

      if (!isAttempted) {
        unattemptedCount++;
      } else if (isCorrect) {
        correctCount++;
        rawScore += activeTest.positiveMarksPerQuestion || 2;
      } else {
        wrongCount++;
        rawScore -= activeTest.negativeMarksPerQuestion || 0.5;
      }

      return {
        questionId: q.id,
        selectedOption: selected ?? null,
        isCorrect,
        timeSpentSeconds: 45,
        status: questionStatuses[q.id] || 'not-visited'
      };
    });

    const attemptedTotal = correctCount + wrongCount;
    const accuracy = attemptedTotal > 0 ? Math.round((correctCount / attemptedTotal) * 100) : 0;
    const finalScore = Math.max(0, Math.round(rawScore * 10) / 10);

    const resultPayload: TestAttemptResult = {
      id: `attempt-${Date.now()}`,
      testId: activeTest.id,
      testTitle: activeTest.title,
      testType: activeTest.type,
      userId: 'user-cgl-01',
      userName: 'Aspirant',
      startedAt: new Date(Date.now() - (activeTest.durationMinutes * 60 - timeRemainingSeconds) * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      totalTimeSpentSeconds: activeTest.durationMinutes * 60 - timeRemainingSeconds,
      totalQuestions,
      attemptedQuestions: attemptedTotal,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unattemptedQuestions: unattemptedCount,
      score: finalScore,
      maxScore: activeTest.totalMarks || 200,
      accuracyPercentage: accuracy,
      sectionBreakdown: [
        {
          subjectId: 'quantitative-aptitude',
          subjectName: 'Quantitative Aptitude',
          score: Math.round(finalScore * 0.28),
          maxScore: 50,
          attempted: Math.round(attemptedTotal * 0.25),
          correct: Math.round(correctCount * 0.25),
          wrong: Math.round(wrongCount * 0.25),
          accuracy: accuracy
        },
        {
          subjectId: 'reasoning',
          subjectName: 'General Intelligence & Reasoning',
          score: Math.round(finalScore * 0.32),
          maxScore: 50,
          attempted: Math.round(attemptedTotal * 0.25),
          correct: Math.round(correctCount * 0.28),
          wrong: Math.round(wrongCount * 0.22),
          accuracy: accuracy + 5
        },
        {
          subjectId: 'english',
          subjectName: 'English Comprehension',
          score: Math.round(finalScore * 0.24),
          maxScore: 50,
          attempted: Math.round(attemptedTotal * 0.25),
          correct: Math.round(correctCount * 0.24),
          wrong: Math.round(wrongCount * 0.26),
          accuracy: accuracy - 3
        },
        {
          subjectId: 'general-awareness',
          subjectName: 'General Awareness',
          score: Math.round(finalScore * 0.16),
          maxScore: 50,
          attempted: Math.round(attemptedTotal * 0.25),
          correct: Math.round(correctCount * 0.23),
          wrong: Math.round(wrongCount * 0.27),
          accuracy: accuracy - 8
        }
      ],
      topicBreakdown: [],
      answers: answerRecords
    };

    try {
      await api.submitTestAttempt(resultPayload);
    } catch (e) {
      console.warn('Backend sync optional:', e);
    }

    // Save in sessionStorage for Quiz Result page
    sessionStorage.setItem('last_test_result', JSON.stringify(resultPayload));

    if (onFinishTest) {
      onFinishTest(resultPayload);
    } else {
      setActivePage('quiz-result');
    }
  };

  const getSubjectTitle = (subId: SubjectId) => {
    switch (subId) {
      case 'quantitative-aptitude': return 'Quantitative Aptitude';
      case 'reasoning': return 'General Intelligence & Reasoning';
      case 'english': return 'English Language';
      case 'general-awareness': return 'General Awareness';
      default: return 'SSC CGL Section';
    }
  };

  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="space-y-4 py-2 select-none">
      
      {/* 1. Examination Top Bar: Subject name, question counts, timer & progress */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('mock-tests')}
              className="p-1.5 rounded-md hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] cursor-pointer"
              title="Return to tests list"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2563EB]">
                  {getSubjectTitle(currentQuestion.subjectId)}
                </span>
                <span aria-hidden="true" className="text-[#64748B]">·</span>
                <span className="text-xs text-[#64748B] font-medium">
                  {currentQuestion.topic}
                </span>
              </div>
              <h1 className="text-sm font-bold text-[#0F172A] mt-0.5">
                {activeTest.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Question Tracker */}
            <div className="text-right">
              <div className="text-xs font-bold text-[#0F172A] tabular-nums">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {countAnswered} Answered
              </div>
            </div>

            {/* Countdown Timer with color-coded alerts */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm tabular-nums ${
              isLowTime
                ? 'bg-red-50 border-red-200 text-[#DC2626] animate-pulse'
                : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>

            {/* Submit Test Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-md bg-[#16A34A] hover:bg-green-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>

        {/* Progress Bar across examination */}
        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mt-3.5">
          <div
            className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Main Question Card + Question Navigator Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left 3 Cols: Question Card & Four Options */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-6">
            
            {/* Question Header & Marks info */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] text-xs text-[#64748B]">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-[#0F172A] font-bold">Q.{currentQuestionIndex + 1}</span>
                <span>Tier 1 Standard (+2.0, -0.50)</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <span>Difficulty:</span>
                <span className="font-semibold text-[#0F172A]">{currentQuestion.difficulty}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base font-medium text-[#0F172A] leading-relaxed">
              {currentQuestion.question}
            </div>

            {/* Four MCQ Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = answers[currentQuestion.id] === optIdx;
                const optionLabel = ['A', 'B', 'C', 'D'][optIdx];

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#2563EB] ring-1 ring-[#2563EB] text-[#0F172A]'
                        : 'bg-white border-[#E2E8F0] hover:border-[#2563EB]/50 hover:bg-[#F8FAFC] text-[#0F172A]'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
                    }`}>
                      {optionLabel}
                    </span>

                    <span className="text-sm flex-1 leading-relaxed">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Bottom Action Controls Bar */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkForReview}
                className="px-3 py-2 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Mark for Review & Next</span>
              </button>

              <button
                onClick={handleClearResponse}
                className="px-3 py-2 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#DC2626] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Response</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-3.5 py-2 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleSaveAndNext}
                className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Col: Question Navigator Palette */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <span className="text-xs font-bold text-[#0F172A]">Question Palette</span>
            <span className="text-[11px] text-[#64748B]">{totalQuestions} Total</span>
          </div>

          {/* Palette Status Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#16A34A] text-white flex items-center justify-center font-bold text-[8px]">✓</span>
              <span>Answered ({countAnswered})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#DC2626] text-white flex items-center justify-center font-bold text-[8px]">!</span>
              <span>Not Answered ({countNotAnswered})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-[8px]">★</span>
              <span>Marked Review ({countMarked})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold text-[8px]">-</span>
              <span>Not Visited ({countNotVisited})</span>
            </div>
          </div>

          {/* Question Grid Buttons */}
          <div className="max-h-80 overflow-y-auto pt-2">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const status = questionStatuses[q.id] || 'not-visited';
                const isCurrent = idx === currentQuestionIndex;

                let bgClass = 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]';
                if (status === 'answered') {
                  bgClass = 'bg-[#16A34A] text-white border-[#16A34A]';
                } else if (status === 'not-answered') {
                  bgClass = 'bg-[#DC2626] text-white border-[#DC2626]';
                } else if (status === 'marked-review' || status === 'answered-marked-review') {
                  bgClass = 'bg-[#8B5CF6] text-white border-[#8B5CF6]';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-8 rounded-md text-xs font-bold border transition-transform flex items-center justify-center cursor-pointer ${bgClass} ${
                      isCurrent ? 'ring-2 ring-[#0F172A] scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Submit Test Action */}
          <div className="pt-3 border-t border-[#E2E8F0]">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2 px-3 rounded-md bg-[#16A34A] hover:bg-green-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Entire Examination</span>
            </button>
          </div>

        </div>

      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Submit Examination?
                </h3>
                <p className="text-xs text-[#64748B]">
                  Are you sure you want to end this test session?
                </p>
              </div>
            </div>

            {/* Test Summary Table */}
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Total Questions:</span>
                <span className="font-bold text-[#0F172A] tabular-nums">{totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Answered Questions:</span>
                <span className="font-bold text-[#16A34A] tabular-nums">{countAnswered}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Marked for Review:</span>
                <span className="font-bold text-[#8B5CF6] tabular-nums">{countMarked}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Not Answered:</span>
                <span className="font-bold text-[#DC2626] tabular-nums">{totalQuestions - countAnswered}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                <span className="text-[#64748B]">Time Remaining:</span>
                <span className="font-bold text-[#2563EB] font-mono tabular-nums">{formatTime(timeRemainingSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold transition-colors cursor-pointer"
              >
                Return to Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 rounded-md bg-[#16A34A] hover:bg-green-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Yes, Final Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
