import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { GeneratedQuestion } from '../../server/ai';
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
  RefreshCw
} from 'lucide-react';

export const AIQuestionGeneratorPage: React.FC = () => {
  const { showToast } = useApp();

  const [subject, setSubject] = useState('Quantitative Aptitude');
  const [topic, setTopic] = useState('Algebra');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  
  // Interactive quiz session on generated questions
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({});

  const topicOptionsBySubject: Record<string, string[]> = {
    'Quantitative Aptitude': [
      'Algebra', 'Percentage', 'Profit and Loss', 'Geometry', 'Trigonometry', 
      'Compound Interest', 'Time and Work', 'Time Speed Distance', 'Number System'
    ],
    'General Intelligence & Reasoning': [
      'Syllogism', 'Coding-Decoding', 'Series', 'Blood Relations', 'Direction Sense', 'Analogy'
    ],
    'English Language': [
      'Error Detection', 'Idioms and Phrases', 'Synonyms and Antonyms', 
      'One Word Substitution', 'Active and Passive Voice', 'Subject-Verb Agreement'
    ],
    'General Awareness': [
      'Indian Polity & Articles', 'Modern History', 'Physical Geography', 'Economics & Inflation', 'General Science'
    ]
  };

  const handleSubjectChange = (newSub: string) => {
    setSubject(newSub);
    const topics = topicOptionsBySubject[newSub] || ['General'];
    setTopic(topics[0]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const qs = await api.generateAIQuestions({
        subject,
        topic,
        difficulty,
        count
      });
      setGeneratedQuestions(qs);
      setSelectedAnswers({});
      setShowSolutions({});
      showToast({
        type: 'success',
        title: 'Quiz Generated!',
        message: `Successfully crafted ${qs.length} fresh SSC CGL questions via Gemini 3.8 Flash.`
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to generate questions with AI' });
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (selectedAnswers[qIdx] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setShowSolutions(prev => ({ ...prev, [qIdx]: true }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  let correctCount = 0;
  Object.entries(selectedAnswers).forEach(([qIdx, ans]) => {
    const q = generatedQuestions[parseInt(qIdx, 10)];
    if (q && ans === q.correctAnswer) correctCount++;
  });

  return (
    <div className="space-y-6 sm:space-y-8 py-2 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-indigo-800/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-amber-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              On-Demand Exam Question Crafting
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              AI Question Generator
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Need extra drill questions on a specific weak subtopic? Select your parameters and let Gemini AI generate custom MCQs complete with options, official answer keys, and shortcut tricks.
        </p>
      </div>

      {/* Generator Configuration Form */}
      <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {Object.keys(topicOptionsBySubject).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Topic / Chapter
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {(topicOptionsBySubject[subject] || []).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Difficulty Tier
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Easy">Easy (Tier-1 Basic)</option>
              <option value="Medium">Medium (Standard CGL)</option>
              <option value="Hard">Hard (Tier-2 Advanced)</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Number of Questions
            </label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions (Recommended)</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={generating}
            className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Questions Now</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Quiz Container */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                Generated Set: {generatedQuestions.length} Qs · {subject} ({topic})
              </span>
            </div>

            <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              Solved: {answeredCount}/{generatedQuestions.length} · {correctCount} Correct
            </div>
          </div>

          <div className="space-y-6">
            {generatedQuestions.map((q, qIdx) => {
              const userAns = selectedAnswers[qIdx];
              const isAnswered = userAns !== undefined;
              const isCorrect = isAnswered && userAns === q.correctAnswer;

              return (
                <div
                  key={qIdx}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Question {qIdx + 1}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {q.difficulty}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = userAns === optIdx;
                      const isTargetCorrect = optIdx === q.correctAnswer;

                      let style = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200';
                      if (isAnswered) {
                        if (isTargetCorrect) {
                          style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold';
                        } else if (isOptionSelected) {
                          style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 font-bold';
                        } else {
                          style = 'border-slate-200 dark:border-slate-800 opacity-60 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          disabled={isAnswered}
                          className={`p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-start gap-3 cursor-pointer ${style}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {isAnswered && isTargetCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          {isAnswered && isOptionSelected && !isTargetCorrect && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation drawer */}
                  {showSolutions[qIdx] && (
                    <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 text-xs text-slate-800 dark:text-slate-200 space-y-2 animate-in fade-in">
                      <div className="font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider text-[10px]">
                        Solution & Explanation:
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

        </div>
      )}

    </div>
  );
};
