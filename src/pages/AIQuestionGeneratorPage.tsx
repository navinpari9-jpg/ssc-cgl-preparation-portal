import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Zap, 
  RotateCcw, 
  Layers, 
  HelpCircle,
  RefreshCw,
  AlertCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export interface GeneratedQuestion {
  question: string;
  options: [string, string, string, string];
  correctAnswer: string | number;
  correctAnswerIndex?: number;
  explanation: string;
  formula?: string;
  shortcut?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export const AIQuestionGeneratorPage: React.FC = () => {
  const { showToast } = useApp();

  const [subject, setSubject] = useState('Quantitative Aptitude');
  const [topic, setTopic] = useState('Percentage');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  
  // Interactive quiz session on generated questions
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({});

  const topicOptionsBySubject: Record<string, string[]> = {
    'Quantitative Aptitude': [
      'Percentage', 'Profit and Loss', 'Number System', 'Simplification', 
      'Algebra', 'Geometry', 'Mensuration', 'Trigonometry', 
      'Compound Interest', 'Simple Interest', 'Time and Work', 'Time Speed Distance'
    ],
    'General Intelligence & Reasoning': [
      'Syllogism', 'Coding-Decoding', 'Series', 'Blood Relations', 
      'Direction Sense', 'Analogy', 'Venn Diagrams', 'Mathematical Operations'
    ],
    'English Language': [
      'Subject-Verb Agreement', 'Error Detection', 'Active and Passive Voice', 
      'Direct and Indirect Speech', 'Idioms and Phrases', 'Synonyms and Antonyms', 
      'One Word Substitution', 'Cloze Test'
    ],
    'General Awareness': [
      'Indian Polity & Articles', 'Modern History', 'Ancient History', 
      'Indian Geography', 'General Science', 'Economics & Inflation', 'Static GK'
    ]
  };

  const handleSubjectChange = (newSub: string) => {
    setSubject(newSub);
    const topics = topicOptionsBySubject[newSub] || ['General'];
    setTopic(topics[0]);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (generating) return;

    setGenerating(true);
    setErrorMsg(null);
    try {
      const qs = await api.generateAIQuestions({
        subject,
        topic,
        difficulty,
        count
      });

      if (!qs || qs.length === 0) {
        throw new Error('Unable to connect to AI. Please check your API configuration and try again.');
      }

      setGeneratedQuestions(qs);
      setSelectedAnswers({});
      setShowSolutions({});
      showToast({
        type: 'success',
        title: 'Questions Generated!',
        message: `Successfully generated ${qs.length} SSC CGL questions via Gemini AI.`
      });
    } catch (err: any) {
      console.error('Failed to generate questions:', err);
      setErrorMsg('Unable to connect to AI. Please check your API configuration and try again.');
      showToast({ 
        type: 'error', 
        title: 'AI Generation Failed',
        message: 'Unable to connect to AI. Please check your API configuration and try again.' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (selectedAnswers[qIdx] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setShowSolutions(prev => ({ ...prev, [qIdx]: true }));
  };

  // Helper to determine if an option is correct
  const isOptionCorrect = (q: GeneratedQuestion, optIdx: number): boolean => {
    if (q.correctAnswerIndex !== undefined && q.correctAnswerIndex === optIdx) {
      return true;
    }
    if (typeof q.correctAnswer === 'number' && q.correctAnswer === optIdx) {
      return true;
    }
    if (typeof q.correctAnswer === 'string') {
      const optStr = q.options[optIdx] || '';
      return optStr.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    }
    return false;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  let correctCount = 0;
  Object.entries(selectedAnswers).forEach(([qIdx, ans]) => {
    const q = generatedQuestions[parseInt(qIdx, 10)];
    if (q && isOptionCorrect(q, ans)) correctCount++;
  });

  return (
    <div className="space-y-6 sm:space-y-8 py-2 max-w-5xl mx-auto text-slate-900">
      
      {/* 1. Page Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300">
              On-Demand Exam Question Crafting · Gemini AI
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-0.5 text-white">
              AI Question Generator
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Need focused practice on a specific weak topic? Select your subject, topic, and difficulty to dynamically generate realistic SSC CGL exam MCQs with calculated options, verified answer keys, formulas, and shortcut tricks.
        </p>
      </div>

      {/* 2. Generator Configuration Form */}
      <form onSubmit={handleGenerate} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Subject</label>
            <select
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              disabled={generating}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
              <option value="General Intelligence & Reasoning">Reasoning Ability</option>
              <option value="English Language">English Language</option>
              <option value="General Awareness">General Awareness</option>
            </select>
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Target Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={generating}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {(topicOptionsBySubject[subject] || ['General']).map(top => (
                <option key={top} value={top}>{top}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Exam Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              disabled={generating}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="Easy">Easy (Tier-1 Basic)</option>
              <option value="Medium">Medium (Standard CBT)</option>
              <option value="Hard">Hard (Tier-2 Advanced)</option>
            </select>
          </div>

          {/* Question Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Number of Questions</label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              disabled={generating}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value={3}>3 Questions (Quick Drill)</option>
              <option value={5}>5 Questions (Standard)</option>
              <option value={10}>10 Questions (Sectional)</option>
            </select>
          </div>

        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Strict SSC CGL 2025-2026 CBT question blueprint</span>
          </div>

          <button
            type="submit"
            disabled={generating}
            className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI is thinking... crafting questions</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Questions with Gemini</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error State with Retry Button */}
      {errorMsg && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{errorMsg}</span>
          </div>
          <button
            onClick={() => handleGenerate()}
            disabled={generating}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 3. Generated Questions Section */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-6">
          
          {/* Summary Scorecard Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                  {subject}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {topic} · {difficulty}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                {generatedQuestions.length} Practice Questions Generated
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] text-slate-500">Score Progress</div>
                <div className="text-sm font-bold text-slate-900">
                  <span className="text-emerald-600">{correctCount}</span> / {answeredCount} Answered
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setShowSolutions({});
                  showToast({ type: 'info', message: 'Quiz reset. Ready to attempt again.' });
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Reset Answers"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-5">
            {generatedQuestions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;
              const isSolutionOpen = showSolutions[qIdx];

              return (
                <div
                  key={qIdx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      Question {qIdx + 1} of {generatedQuestions.length}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {q.difficulty} Level
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                    {q.question}
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = isOptionCorrect(q, optIdx);
                      const isChosen = selectedOpt === optIdx;

                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                        } else if (isChosen) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          disabled={isAnswered}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle} ${isAnswered ? 'cursor-default' : ''}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 font-bold flex items-center justify-center text-xs shrink-0 text-slate-700 shadow-2xs">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </div>

                          {isAnswered && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Solution & Explanation Box */}
                  {isSolutionOpen && (
                    <div className="pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                      
                      {/* Formula & Shortcut Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.formula && (
                          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-blue-900">Formula:</div>
                              <div className="font-mono text-blue-800">{q.formula}</div>
                            </div>
                          </div>
                        )}
                        {q.shortcut && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-amber-900">Shortcut:</div>
                              <div className="text-amber-800">{q.shortcut}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Explanation */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
                        <div className="font-bold text-slate-900 mb-1">Detailed Explanation:</div>
                        <p>{q.explanation}</p>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
