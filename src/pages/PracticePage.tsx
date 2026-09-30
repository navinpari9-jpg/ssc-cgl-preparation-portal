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
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Lightbulb, 
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
        title: 'Correct Answer! (+2.0)',
        message: 'Great deduction. Check the short trick below.'
      });
    } else {
      showToast({
        type: 'error',
        title: 'Incorrect (-0.50)',
        message: `Correct answer was option: "${currentQ.options[currentQ.correctAnswer]}".`
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
  Object.entries(selectedAnswers).forEach(([qIdx, ans]) => {
    const q = questions[parseInt(qIdx, 10)];
    if (q && ans === q.correctAnswer) correctCount++;
  });
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const netScore = Math.round((correctCount * 2.0 - (answeredCount - correctCount) * 0.5) * 10) / 10;

  const isBookmarked = currentQ && user?.bookmarkedQuestionIds.includes(currentQ.id);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* Top Filter and Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Subject:</span>
            <select
              value={filterSubject}
              onChange={(e) => {
                setFilterSubject(e.target.value);
                setActiveTopicFilter(undefined);
              }}
              className="py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              <option value="quantitative-aptitude">Quantitative Aptitude</option>
              <option value="reasoning">General Intelligence & Reasoning</option>
              <option value="english">English Comprehension</option>
              <option value="general-awareness">General Awareness</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Difficulty:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {activeTopicFilter && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <span>Topic: {activeTopicFilter}</span>
              <button
                onClick={() => setActiveTopicFilter(undefined)}
                className="ml-1 hover:text-rose-500"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              timedMode
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timedMode ? `Timed: ${formatTimer(secondsElapsed)}` : 'Enable Timer'}</span>
          </button>

          <button
            onClick={handleResetSession}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Live Session Score Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Attempted</div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {answeredCount} / {questions.length}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Correct</div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {correctCount}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accuracy</div>
          <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {accuracy}%
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Score</div>
          <div className="text-lg font-black text-sky-600 dark:text-sky-400 mt-0.5">
            {netScore} <span className="text-xs text-slate-400 font-normal">marks</span>
          </div>
        </div>
      </div>

      {/* Main Question Display Engine */}
      {loading ? (
        <div className="py-24 text-center text-xs text-slate-400">
          Loading practice questions...
        </div>
      ) : questions.length === 0 ? (
        <div className="py-20 text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="font-bold text-slate-800 dark:text-white">No questions found for this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing a different topic or generate new exam questions with AI!
          </p>
          <button
            onClick={() => setActivePage('ai-generator')}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Questions with AI</span>
          </button>
        </div>
      ) : currentQ ? (
        <div className="space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Question Top Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span>·</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {currentQ.topic}
                </span>
                <span>·</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentQ.difficulty === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' :
                  currentQ.difficulty === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400' :
                  'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                }`}>
                  {currentQ.difficulty}
                </span>

                {currentQ.pyqExam && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {currentQ.pyqExam}
                  </span>
                )}
              </div>

              {/* Actions: Bookmark & Report */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark('question', currentQ.id)}
                  className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Bookmark for revision"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                  <span className="hidden sm:inline text-[11px] font-medium">Save</span>
                </button>

                <button
                  onClick={() => setReportModalOpen(true)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Report question error"
                >
                  <Flag className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px] font-medium">Report</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const hasAnswered = selectedAnswers[currentIndex] !== undefined && selectedAnswers[currentIndex] !== null;
                const isCorrectOption = optIdx === currentQ.correctAnswer;

                let cardStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200';

                if (hasAnswered) {
                  if (isCorrectOption) {
                    cardStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 font-bold';
                  } else {
                    cardStyle = 'border-slate-200 dark:border-slate-800 opacity-60 text-slate-500';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={hasAnswered}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {hasAnswered && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Short Trick Drawer (reveals upon answer) */}
            {showExplanation[currentIndex] && (
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-4 animate-in fade-in slide-in-from-top-2">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Detailed Solution & Formula</span>
                  </div>

                  <button
                    onClick={() => setActivePage('ai-tutor')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor More</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-2">
                  <p>{currentQ.explanation}</p>
                  {currentQ.formulaUsed && (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/50 dark:border-indigo-800/50 text-xs font-mono text-indigo-700 dark:text-indigo-300">
                      Formula: {currentQ.formulaUsed}
                    </div>
                  )}
                </div>

                {currentQ.shortcutTrick && (
                  <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">SSC 15-Second Shortcut Trick: </span>
                      <span>{currentQ.shortcutTrick}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Nav Bar (Previous / Next / Quick Palette) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-xs py-1">
                {questions.map((_, idx) => {
                  const answered = selectedAnswers[idx] !== undefined && selectedAnswers[idx] !== null;
                  const isCur = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all ${
                        isCur
                          ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white'
                          : answered
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : null}

      {/* Report Question Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Report Issue in Question
            </h3>
            <p className="text-xs text-slate-500">
              Let us know if you noticed a typographical error, wrong answer key, or incomplete explanation.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <textarea
                required
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
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
