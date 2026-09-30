import React, { useState } from 'react';
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
  Globe, 
  Copy, 
  Check, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  shortcutTip?: string;
  keyPoints?: string[];
  sampleFollowUp?: string;
  timestamp: string;
}

export const AITutorPage: React.FC = () => {
  const { user, showToast } = useApp();
  const studentName = user?.name || currentUser.name;
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Welcome back, ${currentUser.name}! I am your **AI SSC CGL Preparation Mentor**, powered by Gemini 3.8 Flash.\n\nI can help you with:\n- **Quantitative Aptitude**: Step-by-step solutions, 15-second shortcut tricks, and algebra/geometry theorems.\n- **General Intelligence & Reasoning**: Syllogism Venn methods, coding-decoding patterns, and direction sense.\n- **English Language**: 50 Golden Grammar rules, root words, and error detection logic.\n- **General Awareness**: High-yield Polity articles, Modern History timelines, and Static GK.\n\nFeel free to ask any doubt or pick one of the quick topics below!`,
      shortcutTip: 'SSC Golden Rule: If a + b + c = 0, then a³ + b³ + c³ = 3abc.',
      keyPoints: [
        'Always eliminate options using unit digits or digital sums.',
        'Memorize fraction equivalents 1/1 to 1/20 for instant arithmetic.',
        'Review Previous Year Questions from 2021–2024.'
      ],
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    {
      label: 'Algebra: If x + 1/x = 5, find x³ + 1/x³',
      prompt: 'If x + 1/x = 5, what is the value of x³ + 1/x³? Explain the formula and shortcut trick.'
    },
    {
      label: 'Syllogism: How to solve "Only a few"?',
      prompt: 'Explain how to solve "Only a few A are B" syllogism statements with Venn diagram rules.'
    },
    {
      label: 'English: "Neither...nor" Subject-Verb Rule',
      prompt: 'Explain the grammatical rules of subject-verb agreement when using "neither...nor" and "as well as" with examples.'
    },
    {
      label: 'Polity: Article 32 Writs of Supreme Court',
      prompt: 'Explain the 5 types of Writs under Article 32 of Indian Constitution with high-yield points for SSC CGL.'
    },
    {
      label: 'Math: CI vs SI 2-year difference shortcut',
      prompt: 'Give me the standard shortcut formula and derivation for the difference between CI and SI for 2 years and 3 years.'
    }
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

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
        subject: selectedSubject !== 'All' ? selectedSubject : undefined
      });

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.answer,
        shortcutTip: response.shortcutTip,
        keyPoints: response.keyPoints,
        sampleFollowUp: response.sampleFollowUp,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err: any) {
      showToast({ type: 'error', message: 'Unable to connect to AI Tutor.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast({ type: 'info', message: 'Solution copied to clipboard.' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 py-2 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-indigo-800/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Gemini 3.8 Flash AI
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">
                Live & Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-0.5">
              SSC CGL AI Doubt Solver & Mentor
            </h1>
          </div>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-200">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white focus:outline-none"
          >
            <option value="All" className="text-slate-900">All Subjects</option>
            <option value="Quantitative Aptitude" className="text-slate-900">Quantitative Aptitude</option>
            <option value="Reasoning" className="text-slate-900">Reasoning</option>
            <option value="English" className="text-slate-900">English Language</option>
            <option value="General Awareness" className="text-slate-900">General Awareness</option>
          </select>
        </div>
      </div>

      {/* Quick Prompt Recommendation Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Instant Revision Topics:
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="py-1.5 px-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-2xs hover:shadow-xs cursor-pointer text-left"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Display Box */}
      <div className="min-h-[420px] max-h-[600px] overflow-y-auto space-y-4 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser ? (
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 order-2">
                  {studentName.charAt(0)}
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 space-y-3 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs order-1'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10 dark:border-slate-700/50 text-[10px]">
                  <span className={`font-bold ${isUser ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {isUser ? `${studentName} (You)` : 'SSC CGL AI Mentor (Gemini)'}
                  </span>
                  <span className={isUser ? 'text-indigo-200/70' : 'text-slate-400'}>
                    {msg.timestamp}
                  </span>
                </div>
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Short trick banner */}
                {msg.shortcutTip && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">SSC Exam Trick: </span>
                      <span>{msg.shortcutTip}</span>
                    </div>
                  </div>
                )}

                {/* Key Points */}
                {msg.keyPoints && msg.keyPoints.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Exam Takeaways:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {msg.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">·</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timestamp & Copy action */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-700 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 max-w-sm">
            <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
            <span className="text-xs text-slate-500">Gemini is formulating step-by-step solution...</span>
          </div>
        )}
      </div>

      {/* Input Query Form */}
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
          placeholder="Ask any SSC CGL doubt (e.g. Solve: In a circle with center O, chords AB and CD intersect at P...)"
          className="w-full p-4 pr-24 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
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
          className="absolute right-3 bottom-3 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
