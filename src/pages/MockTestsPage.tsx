import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { 
  MockTest, 
  Question, 
  QuestionPaletteStatus, 
  TestAttemptResult, 
  SubjectId 
} from '../types';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Layers, 
  Check, 
  Flag,
  HelpCircle
} from 'lucide-react';

export const MockTestsPage: React.FC = () => {
  const { user, refreshUser, showToast, setActivePage } = useApp();
  
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Test Execution State
  const [activeTest, setActiveTest] = useState<(MockTest & { questions: Question[] }) | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, QuestionPaletteStatus>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState<Record<string, number>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [testResult, setTestResult] = useState<TestAttemptResult | null>(null);
  const [activeReviewFilter, setActiveReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'unattempted'>('all');

  const timerRef = useRef<any>(null);

  // Load available tests
  useEffect(() => {
    const loadMocks = async () => {
      try {
        const list = await api.getMockTests();
        setMockTests(list);
      } catch (err) {
        console.error('Failed to load mock tests:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMocks();
  }, []);

  // Timer interval during test
  useEffect(() => {
    if (activeTest && !testResult) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });

        // Track time on active question
        const q = activeTest.questions[currentQuestionIndex];
        if (q) {
          setTimeSpentPerQuestion(prev => ({
            ...prev,
            [q.id]: (prev[q.id] || 0) + 1
          }));
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTest, currentQuestionIndex, testResult]);

  const handleStartTest = async (testId: string) => {
    setLoading(true);
    try {
      const detailed = await api.getMockTestById(testId);
      setActiveTest(detailed);
      setTimeRemainingSeconds(detailed.durationMinutes * 60);
      setCurrentQuestionIndex(0);
      
      const initialAnswers: Record<string, number | null> = {};
      const initialStatuses: Record<string, QuestionPaletteStatus> = {};
      detailed.questions.forEach((q, idx) => {
        initialAnswers[q.id] = null;
        initialStatuses[q.id] = idx === 0 ? 'not-answered' : 'not-visited';
      });

      setAnswers(initialAnswers);
      setQuestionStatuses(initialStatuses);
      setTimeSpentPerQuestion({});
      setTestResult(null);
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to initiate mock test' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!activeTest) return;
    const q = activeTest.questions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [q.id]: optionIndex }));
    setQuestionStatuses(prev => ({ ...prev, [q.id]: 'answered' }));
  };

  const handleClearResponse = () => {
    if (!activeTest) return;
    const q = activeTest.questions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [q.id]: null }));
    setQuestionStatuses(prev => ({ ...prev, [q.id]: 'not-answered' }));
  };

  const handleMarkForReviewAndNext = () => {
    if (!activeTest) return;
    const q = activeTest.questions[currentQuestionIndex];
    const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined;

    setQuestionStatuses(prev => ({
      ...prev,
      [q.id]: isAnswered ? 'answered-marked-review' : 'marked-review'
    }));

    if (currentQuestionIndex < activeTest.questions.length - 1) {
      jumpToQuestion(currentQuestionIndex + 1);
    }
  };

  const handleSaveAndNext = () => {
    if (!activeTest) return;
    const q = activeTest.questions[currentQuestionIndex];
    const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined;

    setQuestionStatuses(prev => ({
      ...prev,
      [q.id]: isAnswered ? 'answered' : 'not-answered'
    }));

    if (currentQuestionIndex < activeTest.questions.length - 1) {
      jumpToQuestion(currentQuestionIndex + 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    if (!activeTest) return;
    const targetQ = activeTest.questions[index];
    if (questionStatuses[targetQ.id] === 'not-visited') {
      setQuestionStatuses(prev => ({ ...prev, [targetQ.id]: 'not-answered' }));
    }
    setCurrentQuestionIndex(index);
  };

  const handleAutoSubmit = () => {
    showToast({
      type: 'warning',
      title: 'Time Expired!',
      message: 'Your mock test is being automatically evaluated.'
    });
    calculateAndSubmit();
  };

  const calculateAndSubmit = async () => {
    if (!activeTest) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const questions = activeTest.questions;
    let correctCount = 0;
    let wrongCount = 0;
    let attemptedCount = 0;

    const answerRecords = questions.map(q => {
      const selected = answers[q.id];
      const hasAnswered = selected !== null && selected !== undefined;
      const isCorrect = hasAnswered && selected === q.correctAnswer;
      if (hasAnswered) {
        attemptedCount++;
        if (isCorrect) correctCount++;
        else wrongCount++;
      }
      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
        timeSpentSeconds: timeSpentPerQuestion[q.id] || 0,
        status: questionStatuses[q.id] || 'not-visited'
      };
    });

    const unattempted = questions.length - attemptedCount;
    const posMarks = activeTest.positiveMarksPerQuestion || 2.0;
    const negMarks = activeTest.negativeMarksPerQuestion || 0.5;
    const finalScore = Math.max(0, Math.round((correctCount * posMarks - wrongCount * negMarks) * 10) / 10);
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 1000) / 10 : 0;
    const totalTimeSpent = (activeTest.durationMinutes * 60) - timeRemainingSeconds;

    // Build section breakdown
    const subjectGroups: Record<SubjectId, { total: number; correct: number; wrong: number; attempted: number }> = {
      'quantitative-aptitude': { total: 0, correct: 0, wrong: 0, attempted: 0 },
      'reasoning': { total: 0, correct: 0, wrong: 0, attempted: 0 },
      'english': { total: 0, correct: 0, wrong: 0, attempted: 0 },
      'general-awareness': { total: 0, correct: 0, wrong: 0, attempted: 0 }
    };

    questions.forEach(q => {
      const grp = subjectGroups[q.subjectId];
      if (grp) {
        grp.total++;
        const sel = answers[q.id];
        if (sel !== null && sel !== undefined) {
          grp.attempted++;
          if (sel === q.correctAnswer) grp.correct++;
          else grp.wrong++;
        }
      }
    });

    const sectionBreakdown = Object.entries(subjectGroups).map(([subId, g]) => {
      const name = subId === 'quantitative-aptitude' ? 'Quantitative Aptitude' :
                   subId === 'reasoning' ? 'General Intelligence' :
                   subId === 'english' ? 'English Comprehension' : 'General Awareness';
      const secScore = Math.round((g.correct * posMarks - g.wrong * negMarks) * 10) / 10;
      return {
        subjectId: subId as SubjectId,
        subjectName: name,
        score: secScore,
        maxScore: g.total * posMarks,
        attempted: g.attempted,
        correct: g.correct,
        wrong: g.wrong,
        accuracy: g.attempted > 0 ? Math.round((g.correct / g.attempted) * 100) : 0
      };
    }).filter(s => s.maxScore > 0);

    const attemptPayload = {
      testId: activeTest.id,
      testTitle: activeTest.title,
      testType: activeTest.type,
      userId: user?.id || currentUser.id,
      userName: user?.name || currentUser.name,
      startedAt: new Date(Date.now() - totalTimeSpent * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      totalTimeSpentSeconds: totalTimeSpent,
      totalQuestions: questions.length,
      attemptedQuestions: attemptedCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unattemptedQuestions: unattempted,
      score: finalScore,
      maxScore: questions.length * posMarks,
      accuracyPercentage: accuracy,
      sectionBreakdown,
      topicBreakdown: [],
      answers: answerRecords
    };

    try {
      const saved = await api.submitTestAttempt(attemptPayload);
      setTestResult(saved);
      setShowSubmitModal(false);
      await refreshUser();
      showToast({
        type: 'success',
        title: 'Mock Test Submitted!',
        message: `Your score: ${finalScore} / ${questions.length * posMarks} with ${accuracy}% accuracy.`
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to record test submission' });
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Status counts for palette
  const answeredCount = Object.values(questionStatuses).filter(s => s === 'answered' || s === 'answered-marked-review').length;
  const notAnsweredCount = Object.values(questionStatuses).filter(s => s === 'not-answered').length;
  const markedReviewCount = Object.values(questionStatuses).filter(s => s === 'marked-review' || s === 'answered-marked-review').length;
  const notVisitedCount = Object.values(questionStatuses).filter(s => s === 'not-visited').length;

  // 1. RESULT REVIEW SCREEN
  if (testResult && activeTest) {
    const questions = activeTest.questions;
    const filteredQuestions = questions.filter(q => {
      const ansRec = testResult.answers.find(a => a.questionId === q.id);
      if (activeReviewFilter === 'correct') return ansRec?.isCorrect;
      if (activeReviewFilter === 'wrong') return ansRec?.selectedOption !== null && !ansRec?.isCorrect;
      if (activeReviewFilter === 'unattempted') return ansRec?.selectedOption === null;
      return true;
    });

    return (
      <div className="space-y-6 sm:space-y-8 py-2 animate-in fade-in">
        
        {/* Results Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-indigo-800/40 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                <span>Official Examination Scorecard</span>
                <span>·</span>
                <span className="text-amber-300 font-bold">Candidate: {testResult.userName || user?.name || currentUser.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1">{testResult.testTitle}</h1>
              <p className="text-xs text-slate-300 mt-1">
                Completed in {Math.round(testResult.totalTimeSpentSeconds / 60)} minutes · SSC CGL Tier-1 Marking (+2.0 / -0.50)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTestResult(null);
                  setActiveTest(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
              >
                Back to Mock Tests
              </button>
              <button
                onClick={() => setActivePage('analytics')}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                View Analytics & AI Insights
              </button>
            </div>
          </div>

          {/* Key Result Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-indigo-800/60">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="text-[11px] text-slate-300">Final Score</div>
              <div className="text-2xl font-black text-amber-300 mt-0.5">
                {testResult.score} <span className="text-xs font-normal text-slate-300">/ {testResult.maxScore}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="text-[11px] text-slate-300">Accuracy Rate</div>
              <div className="text-2xl font-black text-emerald-300 mt-0.5">
                {testResult.accuracyPercentage}%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="text-[11px] text-slate-300">Correct / Wrong</div>
              <div className="text-2xl font-black text-sky-300 mt-0.5">
                {testResult.correctAnswers} <span className="text-xs font-normal text-rose-300">/ {testResult.wrongAnswers}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="text-[11px] text-slate-300">Estimated Percentile</div>
              <div className="text-2xl font-black text-purple-300 mt-0.5">
                {Math.min(99.4, Math.max(50, Math.round((testResult.score / testResult.maxScore) * 100 * 10) / 10))}%
              </div>
            </div>
          </div>
        </div>

        {/* Sectional Performance Breakdown */}
        {testResult.sectionBreakdown && testResult.sectionBreakdown.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Section-wise Performance Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {testResult.sectionBreakdown.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {sec.subjectName}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Score:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {sec.score} / {sec.maxScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Accuracy:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {sec.accuracy}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{sec.correct} Correct</span>
                    <span>{sec.wrong} Wrong</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question-by-Question Review with Filter */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Question-by-Question Review & Solutions
            </h2>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveReviewFilter('all')}
                className={`py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeReviewFilter === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setActiveReviewFilter('correct')}
                className={`py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeReviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Correct ({testResult.correctAnswers})
              </button>
              <button
                onClick={() => setActiveReviewFilter('wrong')}
                className={`py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeReviewFilter === 'wrong' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Wrong ({testResult.wrongAnswers})
              </button>
              <button
                onClick={() => setActiveReviewFilter('unattempted')}
                className={`py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeReviewFilter === 'unattempted' ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Unattempted ({testResult.unattemptedQuestions})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const ansRec = testResult.answers.find(a => a.questionId === q.id);
              const userChoice = ansRec?.selectedOption;
              const isCorrect = ansRec?.isCorrect;
              const hasAttempted = userChoice !== null && userChoice !== undefined;

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Question {idx + 1} · {q.topic}
                    </span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      isCorrect ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' :
                      hasAttempted ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isCorrect ? '+2.0 Correct' : hasAttempted ? '-0.50 Incorrect' : '0.0 Unattempted'}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isUserSelected = userChoice === optIdx;
                      const isCorrectAnswer = optIdx === q.correctAnswer;

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isCorrectAnswer
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-100'
                              : isUserSelected
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 font-bold text-rose-900 dark:text-rose-100'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {isUserSelected && !isCorrectAnswer && <XCircle className="w-4 h-4 text-rose-600" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution & Short Trick */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                      Explanation:
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                    {q.shortcutTrick && (
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium">
                        Shortcut Trick: {q.shortcutTrick}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // 2. ACTIVE TEST SIMULATION INTERFACE (NTA / SSC Style)
  if (activeTest) {
    const currentQ = activeTest.questions[currentQuestionIndex];
    const isTimerWarning = timeRemainingSeconds <= 300; // < 5 mins

    return (
      <div className="space-y-4 py-1">
        
        {/* Top Fixed Exam Header Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {activeTest.title}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
              Q {currentQuestionIndex + 1} of {activeTest.questions.length}
            </span>
          </div>

          {/* Countdown Timer with Alert & Candidate Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700">
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                {(user?.name || currentUser.name).charAt(0)}
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user?.name || currentUser.name}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors ${
              isTimerWarning
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span>Time Left: {formatTimer(timeRemainingSeconds)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Submit Test
            </button>
          </div>

        </div>

        {/* Test Screen Grid: Question Area (left) + Question Palette (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Main Question Area (3 Cols) */}
          <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between min-h-[500px]">
            
            {/* Question Header & Subject */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 mb-4">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Section: {currentQ?.subjectId.toUpperCase().replace('-', ' ')}
                </span>
                <span className="text-[11px] text-slate-400">
                  Topic: {currentQ?.topic} · Marks: +2.0, -0.50
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ?.question}
              </h2>

              {/* 4 Radio Options */}
              <div className="space-y-3 mt-6">
                {currentQ?.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQ.id] === optIdx;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-bold ring-1 ring-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearResponse}
                  className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear Response
                </button>

                <button
                  onClick={handleMarkForReviewAndNext}
                  className="py-2 px-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  Mark for Review & Next
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => currentQuestionIndex > 0 && jumpToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleSaveAndNext}
                  className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Save & Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Question Palette (1 Col) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Question Palette
            </h3>

            {/* Official Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-500 shrink-0" />
                <span>Not Answered ({notAnsweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-purple-600 shrink-0" />
                <span>Marked Review ({markedReviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
                <span>Not Visited ({notVisitedCount})</span>
              </div>
            </div>

            {/* Questions Grid Matrix */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {activeTest.questions.map((q, idx) => {
                  const status = questionStatuses[q.id] || 'not-visited';
                  const isCurrent = idx === currentQuestionIndex;

                  let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
                  if (status === 'answered') bgClass = 'bg-emerald-600 text-white font-bold';
                  if (status === 'not-answered') bgClass = 'bg-rose-500 text-white font-bold';
                  if (status === 'marked-review') bgClass = 'bg-purple-600 text-white font-bold';
                  if (status === 'answered-marked-review') bgClass = 'bg-purple-700 text-emerald-300 font-black ring-2 ring-emerald-400';

                  return (
                    <button
                      key={q.id}
                      onClick={() => jumpToQuestion(idx)}
                      className={`h-8 rounded-lg text-xs font-bold transition-all relative flex items-center justify-center cursor-pointer ${bgClass} ${
                        isCurrent ? 'ring-2 ring-indigo-500 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Summary Statistics in Palette */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Total Questions:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeTest.questions.length}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeTest.durationMinutes} mins</span>
              </div>
            </div>

          </div>

        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-in fade-in zoom-in-95">
              <h3 className="text-base font-bold text-slate-900 dark:text-white text-center">
                Submit SSC CGL Mock Test?
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Questions Answered:</span>
                  <span>{answeredCount}</span>
                </div>
                <div className="flex justify-between text-rose-500 font-bold">
                  <span>Not Answered:</span>
                  <span>{notAnsweredCount}</span>
                </div>
                <div className="flex justify-between text-purple-600 font-bold">
                  <span>Marked for Review:</span>
                  <span>{markedReviewCount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Not Visited:</span>
                  <span>{notVisitedCount}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Once submitted, you will receive your detailed scorecard, percentile estimation, and answer explanations.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Resume Test
                </button>
                <button
                  onClick={calculateAndSubmit}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // 3. MOCK TESTS LIST VIEW (Default)
  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>SSC CGL All-India Test Series</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Mock Test Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Full-length Tier-1 & Tier-2 tests, subject-wise speed sprints, and actual previous year papers with negative marking (-0.50).
        </p>
      </div>

      {/* Available Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTests.map(mock => {
          const isFull = mock.type === 'full-tier1';
          const isPYQ = mock.type === 'pyq';

          return (
            <div
              key={mock.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isFull ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800' :
                    isPYQ ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {mock.type.toUpperCase().replace('-', ' ')}
                  </span>

                  <span className="text-[11px] font-semibold text-slate-400">
                    {mock.attemptCount.toLocaleString()} Attempts
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {mock.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {mock.description}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Questions</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{mock.totalQuestions} Qs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Marks</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{mock.totalMarks} Marks</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{mock.durationMinutes} mins</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-rose-500 font-semibold">
                  Negative: -{mock.negativeMarksPerQuestion}
                </span>

                <button
                  onClick={() => handleStartTest(mock.id)}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Start Mock Test</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
