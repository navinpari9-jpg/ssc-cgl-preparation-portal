import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Question } from '../types';
import { 
  History, 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Zap, 
  Play, 
  Filter, 
  Award,
  BookOpen
} from 'lucide-react';

export const PYQPage: React.FC = () => {
  const { user, toggleBookmark, showToast, setActivePage, setActiveTopicFilter } = useApp();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(2023);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const years = [2024, 2023, 2022, 2021];

  const loadPYQs = async () => {
    setLoading(true);
    try {
      const list = await api.getQuestions({
        pyqYear: selectedYear !== 'all' ? selectedYear : undefined,
        subjectId: selectedSubject !== 'all' ? selectedSubject : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined
      });
      // Filter only those with pyqYear set
      const pyqList = list.filter(q => q.pyqYear);
      setQuestions(pyqList);
    } catch (err) {
      console.error('Failed to load PYQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPYQs();
  }, [selectedYear, selectedSubject, selectedDifficulty]);

  const handleSelectOption = (qid: string, optIdx: number) => {
    if (selectedAnswers[qid] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qid]: optIdx }));
    setShowExplanations(prev => ({ ...prev, [qid]: true }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>SSC Official Archives</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Previous Year Questions (PYQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real questions asked in official SSC CGL Tier-1 and Tier-2 shifts with official keys and time-saving shortcut strategies.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Year Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Exam Year:</span>
          <button
            onClick={() => setSelectedYear('all')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedYear === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Years
          </button>
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedYear === yr
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              CGL {yr}
            </button>
          ))}
        </div>

        {/* Subject & Difficulty Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            <option value="quantitative-aptitude">Quantitative Aptitude</option>
            <option value="reasoning">Reasoning</option>
            <option value="english">English Comprehension</option>
            <option value="general-awareness">General Awareness</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

      </div>

      {/* PYQ Question List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading authentic PYQs...</div>
      ) : questions.length === 0 ? (
        <div className="py-20 text-center text-xs text-slate-500">
          No previous year questions found for this filter.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = isAnswered && userChoice === q.correctAnswer;
            const isSaved = user?.bookmarkedQuestionIds.includes(q.id);

            return (
              <div
                key={q.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Q{idx + 1}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {q.topic}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {q.pyqExam || `SSC CGL ${q.pyqYear}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark('question', q.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved ? 'text-amber-500 border-amber-300' : 'text-slate-400 border-transparent hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </p>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    const isCorrectAnswer = optIdx === q.correctAnswer;

                    let optClass = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-800 dark:text-slate-200';
                    if (isAnswered) {
                      if (isCorrectAnswer) {
                        optClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold';
                      } else if (isSelected) {
                        optClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 font-bold';
                      } else {
                        optClass = 'opacity-50 border-slate-200 dark:border-slate-800';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={isAnswered}
                        className={`p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-start gap-3 cursor-pointer ${optClass}`}
                      >
                        <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                        {isAnswered && isCorrectAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Solution Drawer */}
                {showExplanations[q.id] && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-800 dark:text-slate-200 space-y-2 animate-in fade-in">
                    <div className="font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider text-[10px]">
                      Official Examination Solution:
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                    {q.shortcutTrick && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Shortcut Trick: </span>
                          <span>{q.shortcutTrick}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
