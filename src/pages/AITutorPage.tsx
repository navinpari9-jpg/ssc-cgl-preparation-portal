import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { StudentDoubtItem, DoubtType, SimilarPracticeQuestion } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Zap, 
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
  CheckCircle2, 
  Image as ImageIcon, 
  X, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  BookmarkCheck, 
  Filter, 
  Search, 
  Clock, 
  Layers, 
  PlusCircle, 
  FileQuestion,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ActiveDoubtResolution {
  id: string;
  question: string;
  subject: string;
  topic: string;
  doubtType: DoubtType;
  studentAttempt?: string;
  imagePreview?: string;
  answer: string;
  stepByStep: string[];
  formula?: string;
  shortcut?: string;
  examTip?: string;
  commonMistake?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  timeTargetSeconds?: number;
  relatedTopics: string[];
  alternativeMethod?: string;
  simpleExplanation?: string;
  similarQuestion?: SimilarPracticeQuestion;
  savedId?: string;
  timestamp: string;
}

export const AITutorPage: React.FC = () => {
  const { user, showToast } = useApp();
  const studentName = user?.name || currentUser.name;

  // Active view tab: 'solver' | 'notebook' | 'faqs'
  const [activeTab, setActiveTab] = useState<'solver' | 'notebook' | 'faqs'>('solver');

  // Input fields for Doubt Solver
  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Quantitative Aptitude');
  const [selectedTopic, setSelectedTopic] = useState('General');
  const [selectedDoubtType, setSelectedDoubtType] = useState<DoubtType>('problem_solving');
  const [studentAttempt, setStudentAttempt] = useState('');
  const [showAttemptInput, setShowAttemptInput] = useState(false);
  
  // Image attachment
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolution state
  const [loading, setLoading] = useState(false);
  const [followupLoading, setFollowupLoading] = useState<string | null>(null);
  const [activeResolution, setActiveResolution] = useState<ActiveDoubtResolution | null>(null);
  const [savedDoubts, setSavedDoubts] = useState<StudentDoubtItem[]>([]);
  const [loadingNotebook, setLoadingNotebook] = useState(false);

  // Notebook filtering
  const [notebookFilterSubject, setNotebookFilterSubject] = useState('All');
  const [notebookFilterStatus, setNotebookFilterStatus] = useState('all');
  const [notebookSearch, setNotebookSearch] = useState('');
  const [expandedNotebookId, setExpandedNotebookId] = useState<string | null>(null);

  // Follow-up interactive state
  const [userPracticeAnswer, setUserPracticeAnswer] = useState<string | null>(null);
  const [practiceAnswerRevealed, setPracticeAnswerRevealed] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const resultContainerRef = useRef<HTMLDivElement>(null);

  // Load student notebook on mount
  const loadNotebook = async () => {
    setLoadingNotebook(true);
    try {
      const list = await api.getStudentDoubts();
      setSavedDoubts(list);
    } catch (err) {
      console.error('Failed to load notebook:', err);
    } finally {
      setLoadingNotebook(false);
    }
  };

  useEffect(() => {
    loadNotebook();
  }, []);

  // Check for incoming doubt from Practice questions, Mock test reviews, or URL
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Stored pending doubt from question card
    const storedDoubt = sessionStorage.getItem('pending_doubt_question');
    if (storedDoubt) {
      sessionStorage.removeItem('pending_doubt_question');
      try {
        const parsed = JSON.parse(storedDoubt);
        if (parsed.subject) setSelectedSubject(parsed.subject);
        if (parsed.topic) setSelectedTopic(parsed.topic);
        if (parsed.question) {
          setInputQuestion(parsed.question);
          handleResolveDoubt(parsed.question, parsed.subject, parsed.topic);
        }
      } catch (e) {
        console.error('Failed to parse pending doubt question:', e);
      }
    }

    // 2. URL search params (?q=...)
    try {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('q') || params.get('question');
      const subjectParam = params.get('subject');
      if (subjectParam) setSelectedSubject(subjectParam);
      if (queryParam) {
        setInputQuestion(queryParam);
        handleResolveDoubt(queryParam, subjectParam || undefined);
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle image upload from file or paste
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', message: 'Please upload an image file (PNG, JPG, WEBP).' });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast({ type: 'error', message: 'Image size must be under 8MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAttachedImage(result);
      setImageMimeType(file.type);
      showToast({ type: 'info', message: 'Question image attached. Gemini 3.8 Flash will analyze the diagram/text.' });
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          handleImageFile(blob);
          e.preventDefault();
          break;
        }
      }
    }
  };

  // Resolve Doubt using Gemini API
  const handleResolveDoubt = async (
    queryText?: string, 
    overrideSubject?: string, 
    overrideTopic?: string,
    overrideDoubtType?: DoubtType
  ) => {
    const q = (queryText !== undefined ? queryText : inputQuestion).trim();
    if (!q && !attachedImage) {
      showToast({ type: 'error', message: 'Please enter a doubt question or attach an image.' });
      return;
    }

    const sub = overrideSubject || selectedSubject;
    const top = overrideTopic || selectedTopic;
    const dtype = overrideDoubtType || selectedDoubtType;

    setLoading(true);
    setUserPracticeAnswer(null);
    setPracticeAnswerRevealed(false);

    try {
      const response = await api.solveStudentDoubt({
        question: q,
        subject: sub,
        topic: top,
        doubtType: dtype,
        studentAttempt: studentAttempt.trim() || undefined,
        imageData: attachedImage || undefined,
        imageMimeType: attachedImage ? imageMimeType : undefined,
        autoSave: true
      });

      if (!response.success || !response.solution) {
        throw new Error(response.error || 'Unable to solve doubt.');
      }

      const sol = response.solution;
      const resObj: ActiveDoubtResolution = {
        id: `res-${Date.now()}`,
        question: q || 'Image-based doubt question',
        subject: sub,
        topic: top,
        doubtType: dtype,
        studentAttempt: studentAttempt.trim() || undefined,
        imagePreview: attachedImage || undefined,
        answer: sol.answer,
        stepByStep: sol.stepByStep || [sol.answer],
        formula: sol.formula,
        shortcut: sol.shortcut,
        examTip: sol.examTip,
        commonMistake: sol.commonMistake,
        difficulty: sol.difficulty || 'Medium',
        timeTargetSeconds: sol.timeTargetSeconds || 45,
        relatedTopics: sol.relatedTopics || [sub, top],
        alternativeMethod: sol.alternativeMethod,
        simpleExplanation: sol.simpleExplanation,
        similarQuestion: sol.similarQuestion,
        savedId: response.savedDoubtId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setActiveResolution(resObj);
      loadNotebook(); // Refresh notebook list with new doubt
      showToast({ type: 'success', title: 'Doubt Resolved', message: 'Step-by-step breakdown & shortcuts generated by Gemini.' });

      // Scroll to solution
      setTimeout(() => {
        resultContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      console.error('Doubt resolution error:', err);
      showToast({
        type: 'error',
        title: 'Doubt Solver Error',
        message: err.message || 'Unable to connect to Gemini AI. Please check server connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Follow-up Actions
  const handleFollowupAction = async (action: 'explain_simpler' | 'alternative_method' | 'similar_question') => {
    if (!activeResolution || followupLoading) return;

    setFollowupLoading(action);
    try {
      const response = await api.generateDoubtFollowup({
        originalQuestion: activeResolution.question,
        originalAnswer: activeResolution.answer,
        followupAction: action,
        subject: activeResolution.subject,
        topic: activeResolution.topic
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to process follow-up.');
      }

      if (action === 'explain_simpler' && response.content) {
        setActiveResolution(prev => prev ? ({ ...prev, simpleExplanation: response.content }) : null);
        showToast({ type: 'info', title: 'Simplified View', message: 'Beginner-friendly intuition added below.' });
      } else if (action === 'alternative_method' && response.content) {
        setActiveResolution(prev => prev ? ({ ...prev, alternativeMethod: response.content }) : null);
        showToast({ type: 'info', title: 'Alternative Method', message: 'Fast topper approach added.' });
      } else if (action === 'similar_question' && response.similarQuestion) {
        setActiveResolution(prev => prev ? ({ ...prev, similarQuestion: response.similarQuestion }) : null);
        setUserPracticeAnswer(null);
        setPracticeAnswerRevealed(false);
        showToast({ type: 'info', title: 'Practice Question Ready', message: 'Test your understanding on this similar problem.' });
      }
    } catch (err: any) {
      console.error('Follow-up error:', err);
      showToast({ type: 'error', message: err.message || 'Follow-up request failed.' });
    } finally {
      setFollowupLoading(null);
    }
  };

  // Toggle Doubt Status in Notebook
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'resolved' ? 'needs_revision' : 'resolved';
    try {
      await api.updateStudentDoubt(id, { status: nextStatus });
      setSavedDoubts(prev => prev.map(d => d.id === id ? { ...d, status: nextStatus as any } : d));
      showToast({
        type: 'info',
        message: nextStatus === 'resolved' ? 'Marked as Mastered' : 'Marked for Revision'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDoubt = async (id: string) => {
    try {
      await api.deleteStudentDoubt(id);
      setSavedDoubts(prev => prev.filter(d => d.id !== id));
      if (activeResolution?.savedId === id) {
        setActiveResolution(prev => prev ? ({ ...prev, savedId: undefined }) : null);
      }
      showToast({ type: 'info', message: 'Doubt removed from notebook.' });
    } catch (e) {
      console.error(e);
    }
  };

  // Text to Speech
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      showToast({ type: 'error', message: 'Speech synthesis not supported on this browser.' });
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    if (!activeResolution) return;

    const speechText = `${activeResolution.answer}. Step by step: ${activeResolution.stepByStep.join('. ')}. Key formula: ${activeResolution.formula || ''}. Shortcut trick: ${activeResolution.shortcut || ''}.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast({ type: 'info', message: 'Copied to clipboard.' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // High-Yield Sample Prompts for Instant Solving
  const sampleDoubts = [
    {
      subject: 'Quantitative Aptitude',
      topic: 'Percentage & Profit-Loss',
      type: 'problem_solving' as DoubtType,
      title: 'Successive Discounts Trap',
      question: 'A trader marks his goods 40% above cost price and gives two successive discounts of 15% and 10%. Find his net profit or loss percentage. Explain with the fastest 25-second shortcut.'
    },
    {
      subject: 'Quantitative Aptitude',
      topic: 'Time, Speed & Distance',
      type: 'shortcut_trick' as DoubtType,
      title: 'Relative Speed of Trains',
      question: 'Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. Find the ratio of their speeds.'
    },
    {
      subject: 'Reasoning',
      topic: 'Syllogisms',
      type: 'conceptual' as DoubtType,
      title: 'Only A Few Concept',
      question: 'Explain why "All A being B is a possibility" is ALWAYS FALSE when given "Only a few A are B", but "All B being A is a possibility" CAN BE TRUE. Show with Venn diagram logic.'
    },
    {
      subject: 'English',
      topic: 'Spotting Errors',
      type: 'error_analysis' as DoubtType,
      title: 'Inversion After Hardly / Scarcely',
      question: 'Spot the error: "Scarcely had the train arrived at the junction than the passengers rushed to grab the seats." What is the golden pair rule in SSC CGL?'
    },
    {
      subject: 'General Awareness',
      topic: 'Indian Polity',
      type: 'conceptual' as DoubtType,
      title: 'Writ of Habeas Corpus vs Mandamus',
      question: 'What is the constitutional difference between Habeas Corpus and Mandamus under Article 32? Against whom can Mandamus NOT be issued?'
    },
    {
      subject: 'Quantitative Aptitude',
      topic: 'Geometry & Mensuration',
      type: 'formula_clarity' as DoubtType,
      title: 'Inradius of a Right Triangle',
      question: 'Prove and explain the topper speed formula for the inradius of a right-angled triangle r = (a + b - c) / 2. Why does this work?'
    }
  ];

  // Filtered saved doubts for Notebook tab
  const filteredNotebook = savedDoubts.filter(d => {
    if (notebookFilterSubject !== 'All' && !d.subject.toLowerCase().includes(notebookFilterSubject.toLowerCase())) {
      return false;
    }
    if (notebookFilterStatus !== 'all' && d.status !== notebookFilterStatus) {
      return false;
    }
    if (notebookSearch.trim()) {
      const q = notebookSearch.toLowerCase().trim();
      return (
        d.question.toLowerCase().includes(q) ||
        d.topic.toLowerCase().includes(q) ||
        (d.solution.formula && d.solution.formula.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 py-2 max-w-5xl mx-auto text-slate-900">
      
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Gemini 3.8 Flash AI Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Multimodal OCR & Reasoning
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              AI Student Doubt Support Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Instant step-by-step resolution, topper shortcuts, examiner traps, photo OCR question solver, and personalized revision notebook.
            </p>
          </div>
        </div>

        {/* Tab Selector in Header */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-700/80 shrink-0 self-start md:self-center">
          <button
            onClick={() => setActiveTab('solver')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'solver'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Doubt Solver</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('notebook');
              loadNotebook();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notebook'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Notebook</span>
            {savedDoubts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-mono">
                {savedDoubts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'faqs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>High-Yield Doubts</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LIVE DOUBT SOLVER WORKSPACE                         */}
      {/* ========================================================= */}
      {activeTab === 'solver' && (
        <div className="space-y-6">

          {/* Doubt Submission Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            
            {/* Top Controls: Subject & Doubt Category */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Reasoning">Reasoning Ability</option>
                  <option value="English">English Language</option>
                  <option value="General Awareness">General Awareness</option>
                </select>
              </div>

              {/* Doubt Category Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 mr-1">Type:</span>
                {[
                  { id: 'problem_solving', label: 'Step-by-Step Solve' },
                  { id: 'conceptual', label: 'Concept Clarity' },
                  { id: 'shortcut_trick', label: 'Topper Shortcut' },
                  { id: 'error_analysis', label: 'Why Was I Wrong?' }
                ].map((dt) => (
                  <button
                    key={dt.id}
                    type="button"
                    onClick={() => setSelectedDoubtType(dt.id as DoubtType)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                      selectedDoubtType === dt.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {dt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Textarea with Drag/Paste Image Support */}
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  rows={3}
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  onPaste={handlePaste}
                  disabled={loading}
                  placeholder="Paste or type your student doubt here... (e.g., In an equilateral triangle ABC, if side is 12 cm, find radius of inscribed circle. Or paste a screenshot directly with Ctrl+V)"
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed resize-y"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleResolveDoubt();
                    }
                  }}
                />
              </div>

              {/* Image Preview if Attached */}
              {attachedImage && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="w-14 h-14 rounded-lg bg-white border border-blue-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <img 
                      src={attachedImage} 
                      alt="Question snippet" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Question Image Attached</span>
                    </div>
                    <div className="text-[11px] text-blue-700 truncate">
                      Gemini OCR will transcribe mathematical equations, geometry figures, and options.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAttachedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 rounded-lg hover:bg-blue-200 text-blue-700 transition-colors cursor-pointer"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Optional: Student's Attempt / Misconception */}
              {showAttemptInput ? (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>What was your thought process or chosen option? (Helps AI pinpoint your mistake)</span>
                    </span>
                    <button
                      onClick={() => {
                        setShowAttemptInput(false);
                        setStudentAttempt('');
                      }}
                      className="text-amber-700 hover:text-amber-900 text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={studentAttempt}
                    onChange={(e) => setStudentAttempt(e.target.value)}
                    placeholder="e.g. I picked option B because I multiplied by 2 instead of dividing, but answer key says C."
                    className="w-full py-1.5 px-3 rounded-lg bg-white border border-amber-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAttemptInput(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add what you tried / Which option you marked wrong (for targeted error analysis)</span>
                </button>
              )}
            </div>

            {/* Bottom Form Actions: Image Upload & Submit Button */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-blue-400 bg-white text-slate-700 hover:text-blue-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Upload photo of question from textbook or test paper"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Attach Image / Photo</span>
                </button>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  (or paste screenshot directly)
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleResolveDoubt()}
                disabled={(!inputQuestion.trim() && !attachedImage) || loading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini is Solving Doubt...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Clear Doubt with Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Authentic Aspirant Doubts to Try */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Frequently Confused Aspirant Doubts (Click to Solve):</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {sampleDoubts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSubject(sample.subject);
                    setSelectedTopic(sample.topic);
                    setSelectedDoubtType(sample.type);
                    setInputQuestion(sample.question);
                    handleResolveDoubt(sample.question, sample.subject, sample.topic, sample.type);
                  }}
                  disabled={loading}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all shadow-2xs cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700">
                      {sample.subject}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
                      Solve <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {sample.question}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Resolution Display Card */}
          {activeResolution && (
            <div 
              ref={resultContainerRef}
              className="p-6 rounded-2xl bg-white border border-blue-200 shadow-md space-y-5 animate-fadeIn"
            >
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                      {activeResolution.subject} · {activeResolution.topic}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      activeResolution.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                      activeResolution.difficulty === 'Hard' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {activeResolution.difficulty} Difficulty
                    </span>
                    {activeResolution.timeTargetSeconds && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Target: {activeResolution.timeTargetSeconds}s
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 italic mt-1">
                    Question: "{activeResolution.question.slice(0, 140)}{activeResolution.question.length > 140 ? '...' : ''}"
                  </div>
                </div>

                {/* Top Action Tools: Listen Aloud & Copy */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleToggleSpeech}
                    className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      speaking 
                        ? 'bg-rose-50 border-rose-300 text-rose-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                    title={speaking ? 'Stop audio' : 'Listen to solution'}
                  >
                    {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
                    <span className="hidden sm:inline">{speaking ? 'Stop' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(activeResolution.id, `${activeResolution.answer}\n\nStep by Step:\n${activeResolution.stepByStep.join('\n')}\n\nFormula: ${activeResolution.formula || 'N/A'}\nShortcut: ${activeResolution.shortcut || 'N/A'}`)}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Copy Full Solution"
                  >
                    {copiedId === activeResolution.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600 font-bold hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 1. Core Final Answer Verdict */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                    Solution Verdict / Final Answer
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {activeResolution.answer}
                  </div>
                </div>
              </div>

              {/* 2. Step-by-Step Pedagogical Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span>Step-by-Step Mathematical & Conceptual Breakdown:</span>
                </div>
                <div className="space-y-2">
                  {activeResolution.stepByStep.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="leading-relaxed font-sans flex-1">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Core Formula Box */}
              {activeResolution.formula && (
                <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-indigo-900 text-xs uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Core Formula / Theoretical Law Utilized:</span>
                      <button
                        onClick={() => handleCopy('formula', activeResolution.formula!)}
                        className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium"
                      >
                        Copy Formula
                      </button>
                    </div>
                    <div className="font-mono text-xs text-indigo-900 bg-white/70 p-2.5 rounded-lg border border-indigo-200/60 font-semibold">
                      {activeResolution.formula}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Speed Shortcut Trick Box */}
              {activeResolution.shortcut && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-1">
                      Topper Speed Shortcut & 30-Second Elimination Trick:
                    </div>
                    <div className="text-amber-900 font-medium leading-relaxed bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                      {activeResolution.shortcut}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Common Student Traps & Examiner Pitfalls */}
              {activeResolution.commonMistake && (
                <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-1">
                      Common Examiner Trap & Why Students Get Confused:
                    </div>
                    <div className="text-rose-900 leading-relaxed font-medium">
                      {activeResolution.commonMistake}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. High-Yield Exam Tip */}
              {activeResolution.examTip && (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-1">
                      CBT Examination Strategy Tip:
                    </div>
                    <div className="text-emerald-900 leading-relaxed">
                      {activeResolution.examTip}
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Simplified Intuition (If Generated) */}
              {activeResolution.simpleExplanation && (
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1.5 animate-fadeIn">
                  <div className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Beginner-Friendly Intuition (Simplified View):</span>
                  </div>
                  <div className="text-xs text-sky-950 leading-relaxed whitespace-pre-wrap font-sans">
                    {activeResolution.simpleExplanation}
                  </div>
                </div>
              )}

              {/* 8. Alternative Method (If Generated) */}
              {activeResolution.alternativeMethod && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1.5 animate-fadeIn">
                  <div className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>Alternative Solving Method (Ratio / Substitution):</span>
                  </div>
                  <div className="text-xs text-purple-950 leading-relaxed whitespace-pre-wrap font-sans">
                    {activeResolution.alternativeMethod}
                  </div>
                </div>
              )}

              {/* 9. Interactive Similar Practice Question */}
              {activeResolution.similarQuestion && (
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3.5 animate-fadeIn shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <FileQuestion className="w-4 h-4 text-blue-400" />
                      <span>Test Yourself: Practice Problem on the Same Concept</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                      Interactive Drill
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-slate-100">
                    {activeResolution.similarQuestion.question}
                  </div>

                  {/* 4 Interactive Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeResolution.similarQuestion.options.map((opt, i) => {
                      const optLabel = ['A', 'B', 'C', 'D'][i];
                      const isChosen = userPracticeAnswer === opt;
                      const isCorrect = opt.trim().toLowerCase() === activeResolution.similarQuestion?.correctAnswer.trim().toLowerCase();

                      let btnStyle = 'bg-slate-800 border-slate-700 text-slate-200 hover:border-blue-400 hover:bg-slate-800/80';
                      if (practiceAnswerRevealed) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-900/60 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isChosen) {
                          btnStyle = 'bg-rose-900/60 border-rose-500 text-rose-200';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-blue-600 border-blue-400 text-white font-bold';
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setUserPracticeAnswer(opt);
                            setPracticeAnswerRevealed(true);
                          }}
                          className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {optLabel}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {practiceAnswerRevealed && isCorrect && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after click */}
                  {practiceAnswerRevealed && (
                    <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1 animate-fadeIn">
                      <div className="font-bold text-emerald-400">
                        {userPracticeAnswer?.trim().toLowerCase() === activeResolution.similarQuestion.correctAnswer.trim().toLowerCase()
                          ? '🎉 Correct! Your concept is solid.'
                          : `Correct Answer: ${activeResolution.similarQuestion.correctAnswer}`}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {activeResolution.similarQuestion.explanation}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 10. Interactive Follow-up Bar */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleFollowupAction('explain_simpler')}
                    disabled={!!followupLoading}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {followupLoading === 'explain_simpler' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
                    <span>Explain Simpler</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFollowupAction('alternative_method')}
                    disabled={!!followupLoading}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {followupLoading === 'alternative_method' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    <span>Show Alternative Method</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFollowupAction('similar_question')}
                    disabled={!!followupLoading}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {followupLoading === 'similar_question' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileQuestion className="w-3.5 h-3.5" />}
                    <span>Practice Similar Question</span>
                  </button>
                </div>

                {/* Notebook Bookmark Confirmation */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Saved in Doubt Notebook</span>
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MY DOUBT NOTEBOOK (STUDENT REVISION ARCHIVE)        */}
      {/* ========================================================= */}
      {activeTab === 'notebook' && (
        <div className="space-y-4">
          
          {/* Notebook Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={notebookSearch}
                  onChange={(e) => setNotebookSearch(e.target.value)}
                  placeholder="Search past doubts, formulas, topics..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Subject filter */}
              <select
                value={notebookFilterSubject}
                onChange={(e) => setNotebookFilterSubject(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Subjects</option>
                <option value="Quantitative">Quantitative Aptitude</option>
                <option value="Reasoning">Reasoning</option>
                <option value="English">English</option>
                <option value="General Awareness">General Awareness</option>
              </select>

              {/* Status filter */}
              <select
                value={notebookFilterStatus}
                onChange={(e) => setNotebookFilterStatus(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="resolved">Mastered</option>
                <option value="needs_revision">Needs Revision</option>
                <option value="bookmarked">Bookmarked</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Total Saved: <strong className="text-blue-600">{filteredNotebook.length}</strong> doubts
            </div>
          </div>

          {/* Notebook List */}
          {loadingNotebook ? (
            <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading your Doubt Notebook...</span>
            </div>
          ) : filteredNotebook.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No doubts match your filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ask any doubt in the Live Doubt Solver tab, and it will automatically be saved to your personal revision notebook.
              </p>
              <button
                onClick={() => setActiveTab('solver')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Ask a Doubt Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotebook.map((doubt) => {
                const isExpanded = expandedNotebookId === doubt.id;
                return (
                  <div
                    key={doubt.id}
                    className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
                  >
                    {/* Doubt Header Bar */}
                    <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                            {doubt.subject}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            {doubt.topic}
                          </span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            doubt.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {doubt.status === 'resolved' ? '✓ Mastered' : '⚠ Needs Revision'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(doubt.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {doubt.question}
                        </div>

                        {doubt.studentAttempt && (
                          <div className="text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/70 inline-block">
                            <strong>My Confusion:</strong> {doubt.studentAttempt}
                          </div>
                        )}
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleStatus(doubt.id, doubt.status)}
                          className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                            doubt.status === 'resolved'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                          }`}
                          title="Toggle Mastered / Revision Status"
                        >
                          <BookmarkCheck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setExpandedNotebookId(isExpanded ? null : doubt.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide' : 'Review'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDeleteDoubt(doubt.id)}
                          className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete from Notebook"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Solution View */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 space-y-4 text-xs animate-fadeIn">
                        
                        {/* Direct Verdict */}
                        <div className="p-3.5 rounded-xl bg-white border border-blue-200">
                          <div className="font-bold text-blue-900 mb-0.5">Final Solution:</div>
                          <div className="text-slate-900 font-semibold">{doubt.solution.answer}</div>
                        </div>

                        {/* Step by step */}
                        {doubt.solution.stepByStep && doubt.solution.stepByStep.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                              Step-by-Step Breakdown:
                            </div>
                            <div className="space-y-1.5">
                              {doubt.solution.stepByStep.map((s, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                                  {s}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Formula & Shortcut Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {doubt.solution.formula && (
                            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
                              <div className="font-bold text-indigo-900 mb-0.5">Formula:</div>
                              <div className="font-mono text-indigo-800 text-[11px]">{doubt.solution.formula}</div>
                            </div>
                          )}

                          {doubt.solution.shortcut && (
                            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                              <div className="font-bold text-amber-900 mb-0.5">Topper Shortcut:</div>
                              <div className="text-amber-800 font-medium text-[11px]">{doubt.solution.shortcut}</div>
                            </div>
                          )}
                        </div>

                        {/* Examiner traps */}
                        {doubt.solution.commonMistake && (
                          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900">
                            <strong>Common Trap:</strong> {doubt.solution.commonMistake}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => {
                              setSelectedSubject(doubt.subject);
                              setSelectedTopic(doubt.topic);
                              setInputQuestion(doubt.question);
                              setActiveTab('solver');
                              handleResolveDoubt(doubt.question, doubt.subject, doubt.topic, doubt.doubtType);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Re-Solve in Live Workspace</span>
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: HIGH-YIELD FAQS & TRICKY CONCEPTS                   */}
      {/* ========================================================= */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              High-Yield SSC CGL Conceptual Doubts
            </h2>
            <p className="text-xs text-slate-500">
              These 12 recurring topics account for over 35% of negative marking traps in Tier-1 & Tier-2. Click any concept to load full Gemini explanation and shortcut tricks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                subject: 'Quantitative Aptitude',
                topic: 'Arithmetic',
                title: 'km/h to m/s conversion factor (5/18)',
                concept: 'Why do we multiply by 5/18 for km/h to m/s and 18/5 for m/s to km/h? Memory trick so you never reverse them under exam pressure.',
                query: 'Explain the conversion factor 5/18 and 18/5 between km/h and m/s, derivation, and give an infallible memory trick to avoid confusing them in train problems.'
              },
              {
                subject: 'Quantitative Aptitude',
                topic: 'Compound Interest',
                title: 'CI vs SI Difference for 2 & 3 Years',
                concept: 'Master formulas for Difference between CI and SI: D = P(R/100)² for 2 years and D = P(R/100)² × (3 + R/100) for 3 years.',
                query: 'Derive and explain the shortcuts for the difference between CI and SI for 2 years and 3 years in SSC CGL with examples.'
              },
              {
                subject: 'Quantitative Aptitude',
                topic: 'Alligation & Mixture',
                title: 'Which quantity goes in the denominator in Alligation?',
                concept: 'The golden rule of Alligation: The ratio obtained at the bottom is always with respect to the denominator quantity (e.g., CP gives quantity, Speed gives time).',
                query: 'Explain the Alligation Rule in Quantitative Aptitude: how to determine whether the resulting bottom ratio represents quantity, cost, or time.'
              },
              {
                subject: 'Reasoning',
                topic: 'Syllogisms',
                title: 'Definite vs Possibility Conclusions',
                concept: 'When is a conclusion definitely true versus when does a "possibility" apply? The 3 golden rules for Venn diagram overlaps.',
                query: 'Explain the difference between definite conclusions and possibility conclusions in SSC CGL Syllogisms with examples.'
              },
              {
                subject: 'Reasoning',
                topic: 'Coding-Decoding',
                title: 'Opposite Letter Pairs (AZ, BY, CX...)',
                concept: 'Instant mnemonic for reverse alphabet pairs (sum of place values = 27): Azad, Boy, Crack, Doodh-wala, EVen, etc.',
                query: 'Give me the top mnemonic memory tricks to memorize opposite alphabet letters (A-Z to M-N) for SSC CGL Coding-Decoding in 2 minutes.'
              },
              {
                subject: 'English',
                topic: 'Grammar',
                title: 'Subject-Verb Agreement with "One of the..."',
                concept: 'Rule of "One of the [Plural Noun] + [Singular Verb]" VS "One of the [Plural Noun] + who/that + [Plural Verb]".',
                query: 'Explain the Subject-Verb Agreement rules for "One of the" and "One of the + relative pronoun (who/which)" with high-frequency SSC CGL error examples.'
              },
              {
                subject: 'English',
                topic: 'Grammar',
                title: 'Conditionals: If + Past Perfect, would have + V3',
                concept: 'The 3 conditional sentence types (Zero, First, Second, Third conditional) tested in SSC CGL sentence improvement.',
                query: 'Explain the 3 conditional sentence formulas tested in SSC CGL error spotting (If + had + V3, would have + V3) with examples.'
              },
              {
                subject: 'General Awareness',
                topic: 'Polity',
                title: 'Fundamental Rights vs Directive Principles (DPSP)',
                concept: 'Justiciability difference: Part III (Enforceable by Courts under Art 32/226) vs Part IV (Non-justiciable fundamental governance principles).',
                query: 'Explain the constitutional difference between Fundamental Rights (Part III) and Directive Principles (Part IV) in SSC CGL.'
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-400 transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {faq.subject} · {faq.topic}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {faq.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {faq.concept}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubject(faq.subject);
                    setSelectedTopic(faq.topic);
                    setSelectedDoubtType('conceptual');
                    setInputQuestion(faq.query);
                    setActiveTab('solver');
                    handleResolveDoubt(faq.query, faq.subject, faq.topic, 'conceptual');
                  }}
                  className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Clear This Doubt with Gemini</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
