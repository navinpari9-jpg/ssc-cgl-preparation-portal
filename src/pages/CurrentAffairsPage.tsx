import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CurrentAffairItem } from '../types';
import { 
  Globe2, 
  Search, 
  Bookmark, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Tag, 
  Play 
} from 'lucide-react';

export const CurrentAffairsPage: React.FC = () => {
  const { showToast } = useApp();
  
  const [items, setItems] = useState<CurrentAffairItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive mini quiz states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const categories = [
    'All', 'National', 'International', 'Economy', 'Science & Tech', 
    'Sports', 'Awards', 'Appointments', 'Govt Schemes', 'Important Days'
  ];

  const loadCurrentAffairs = async () => {
    setLoading(true);
    try {
      const list = await api.getCurrentAffairs(selectedCategory, searchQuery);
      setItems(list);
    } catch (err) {
      console.error('Failed to load current affairs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentAffairs();
  }, [selectedCategory, searchQuery]);

  const handleSelectQuizAnswer = (itemId: string, qIdx: number, optIdx: number) => {
    const key = `${itemId}-${qIdx}`;
    if (selectedAnswers[key] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [key]: optIdx }));
    setRevealedSolutions(prev => ({ ...prev, [key]: true }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>General Awareness Tier-1 Booster</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Current Affairs & National Digest
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Exam-calibrated current affairs capsules with interactive practice quizzes directly relevant to SSC CGL 2026-2027.
        </p>
      </div>

      {/* Categories & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search news, summits, schemes, or scientific milestones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Current Affairs Articles with Embedded Quizzes */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading current affairs...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-xs text-slate-500">
          No current affairs matching this category.
        </div>
      ) : (
        <div className="space-y-6">
          {items.map(item => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                    {item.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.detailedText}
                </p>
              </div>

              {/* Embedded Exam Practice Quiz */}
              {item.sampleQuestions && item.sampleQuestions.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>Associated Exam MCQ Practice:</span>
                  </div>

                  {item.sampleQuestions.map((sq, sqIdx) => {
                    const key = `${item.id}-${sqIdx}`;
                    const userAns = selectedAnswers[key];
                    const isAnswered = userAns !== undefined;
                    const isCorrect = isAnswered && userAns === sq.correctAnswer;

                    return (
                      <div
                        key={sqIdx}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {sq.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sq.options.map((opt, optIdx) => {
                            const isSelected = userAns === optIdx;
                            const isCorrectOpt = optIdx === sq.correctAnswer;

                            let optStyle = 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
                            if (isAnswered) {
                              if (isCorrectOpt) {
                                optStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold';
                              } else if (isSelected) {
                                optStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 font-bold';
                              } else {
                                optStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectQuizAnswer(item.id, sqIdx, optIdx)}
                                disabled={isAnswered}
                                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                                {isAnswered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                {isAnswered && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-600" />}
                              </button>
                            );
                          })}
                        </div>

                        {revealedSolutions[key] && (
                          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 text-xs text-indigo-950 dark:text-indigo-200 animate-in fade-in">
                            <span className="font-bold">Exam Note: </span>
                            <span>{sq.explanation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
