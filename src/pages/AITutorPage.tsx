import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Zap, 
  Calculator, 
  Brain, 
  BookOpen, 
  Copy, 
  Check, 
  RefreshCw,
  HelpCircle,
  Trash2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  formula?: string;
  shortcut?: string;
  examTip?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  relatedTopics?: string[];
  isError?: boolean;
  failedQuery?: string;
  timestamp: string;
}

export const AITutorPage: React.FC = () => {
  const { user, showToast, setActivePage } = useApp();
  const studentName = user?.name || currentUser.name;
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Hello ${studentName}! I am your **SSC CGL AI Doubt Solver & Exam Mentor**, powered by Google Gemini.\n\nAsk me any doubt from the SSC CGL syllabus (Quantitative Aptitude, Reasoning, English Comprehension, or General Awareness), and I will provide you with the correct answer, step-by-step breakdown, formula, time-saving shortcut, and exam tip.`,
      formula: 'SSC Pattern Target: Speed < 45 seconds per question · Accuracy > 85%',
      shortcut: 'Symmetric variable substitution: if a + b + c = 0, then a³ + b³ + c³ = 3abc.',
      examTip: 'Always check if units are uniform (convert km/h to m/s by multiplying 5/18) before computing.',
      relatedTopics: ['Algebra', 'Percentage', 'Syllogism', 'Grammar Rules', 'Indian Polity'],
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Section 16 Quick Prompts
  const quickPrompts = [
    {
      label: 'Explain this topic',
      prompt: 'Explain the core concepts and theorems of Cyclic Quadrilaterals in Geometry with high-yield rules for SSC CGL.'
    },
    {
      label: 'Solve a Quant question',
      prompt: 'Solve this percentage question and explain it step by step: A person spends 75% of his income. His income increases by 20% and expenditure increases by 10%. Find the percentage increase in his savings.'
    },
    {
      label: 'Give me a shortcut',
      prompt: 'Give me the top 3 speed shortcut tricks for solving Time, Speed, and Distance train-crossing problems in under 20 seconds.'
    },
    {
      label: 'Create 5 practice questions',
      prompt: 'Generate 5 high-yield SSC CGL Tier-1 level practice questions on Syllogism with answers and explanations.'
    },
    {
      label: 'Analyze my performance',
      prompt: 'Based on my recent SSC CGL mock test average of 148/200 and 78% accuracy, what are my critical weak points and target strategy?'
    },
    {
      label: "Make today's study plan",
      prompt: 'Create a focused 4.5-hour daily study schedule for SSC CGL Tier-1 covering Quantitative Aptitude, Reasoning, English, and General Awareness.'
    }
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await api.askAITutor(textToSend, {
        subject: selectedSubject !== 'All' ? selectedSubject : undefined,
        topic: 'SSC CGL Preparation'
      });

      if (!response.success && response.error) {
        throw new Error(response.error);
      }

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.answer || 'Here is the step-by-step explanation for your question.',
        formula: response.formula,
        shortcut: response.shortcut,
        examTip: response.examTip,
        difficulty: response.difficulty,
        relatedTopics: response.relatedTopics || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err: any) {
      console.error('AI Tutor Query Error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: 'Unable to connect to AI. Please check your API configuration and try again.',
        isError: true,
        failedQuery: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
      showToast({
        type: 'error',
        title: 'AI Connection Error',
        message: 'Unable to connect to AI. Please check your API configuration and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = (failedQuery?: string) => {
    if (failedQuery) {
      handleSend(failedQuery);
    } else {
      const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
      if (lastUserMsg) {
        handleSend(lastUserMsg.text);
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast({ type: 'info', message: 'Solution copied to clipboard.' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `cleared-${Date.now()}`,
        sender: 'tutor',
        text: `Chat cleared. Ready for your next SSC CGL question, ${studentName}!`,
        timestamp: 'Just now'
      }
    ]);
    showToast({ type: 'info', message: 'Chat history cleared.' });
  };

  return (
    <div className="space-y-6 py-2 max-w-5xl mx-auto text-slate-900">
      
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Live Gemini AI
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">
              SSC CGL AI Doubt Solver & Mentor
            </h1>
          </div>
        </div>

        {/* Controls: Subject & Clear Chat */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 hidden sm:inline">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="All">All Subjects</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
              <option value="Reasoning">Reasoning Ability</option>
              <option value="English">English Language</option>
              <option value="General Awareness">General Awareness</option>
            </select>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick Prompt Recommendation Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant Suggested Prompts:</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-500 hover:bg-blue-50/50 text-xs font-medium text-slate-700 hover:text-blue-700 transition-all shadow-2xs cursor-pointer text-left disabled:opacity-50"
            >
              <div className="text-[11px] font-bold text-blue-600 truncate">{qp.label}</div>
              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{qp.prompt}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Chat Messages Display Area */}
      <div className="min-h-[440px] max-h-[620px] overflow-y-auto space-y-4 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser ? (
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 order-2">
                  {studentName.charAt(0)}
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 space-y-3.5 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs order-1 shadow-sm'
                    : msg.isError
                    ? 'bg-rose-50 border border-rose-200 text-slate-900 rounded-tl-xs'
                    : 'bg-slate-50 border border-slate-200/90 text-slate-900 rounded-tl-xs shadow-2xs'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
                  <span className={`font-bold flex items-center gap-1.5 ${isUser ? 'text-blue-100' : 'text-blue-700'}`}>
                    {isUser ? `${studentName} (You)` : 'SSC CGL AI Mentor (Gemini)'}
                    {msg.difficulty && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">
                        {msg.difficulty}
                      </span>
                    )}
                  </span>
                  <span className={isUser ? 'text-blue-200' : 'text-slate-400'}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Error Banner */}
                {msg.isError ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs sm:text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                    <button
                      onClick={() => handleRetry(msg.failedQuery)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  </div>
                ) : (
                  /* Main Solution Body */
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>
                )}

                {/* Formula Box */}
                {msg.formula && (
                  <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-blue-900 mb-0.5">Formula / Standard Rule:</div>
                      <div className="font-mono text-blue-800">{msg.formula}</div>
                    </div>
                  </div>
                )}

                {/* Speed Shortcut Box */}
                {msg.shortcut && (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900 mb-0.5">Topper Shortcut & Speed Trick:</div>
                      <div className="text-amber-800">{msg.shortcut}</div>
                    </div>
                  </div>
                )}

                {/* Exam Tip Box */}
                {msg.examTip && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-900 mb-0.5">Exam Trap & Strategy Tip:</div>
                      <div className="text-emerald-800">{msg.examTip}</div>
                    </div>
                  </div>
                )}

                {/* Related Topics Chips */}
                {msg.relatedTopics && msg.relatedTopics.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Related:</span>
                    {msg.relatedTopics.map((rt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(`Explain the core rules and past questions for ${rt} in SSC CGL.`)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        {rt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Bottom Actions: Copy Solution */}
                {!isUser && !msg.isError && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified SSC CGL Pattern</span>
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, `${msg.text}\n\nFormula: ${msg.formula || 'N/A'}\nShortcut: ${msg.shortcut || 'N/A'}`)}
                      className="text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Solution</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 max-w-sm animate-pulse">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-xs font-semibold text-blue-900">
              AI is thinking... calculating step-by-step solution
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Question Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative"
      >
        <textarea
          rows={2}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={loading}
          placeholder="Ask any SSC CGL doubt (e.g. Solve: In a circle with center O, chords AB and CD intersect at P...)"
          className="w-full p-4 pr-28 text-xs sm:text-sm rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="absolute right-3 bottom-3 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Thinking...</span>
            </>
          ) : (
            <>
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

    </div>
  );
};
