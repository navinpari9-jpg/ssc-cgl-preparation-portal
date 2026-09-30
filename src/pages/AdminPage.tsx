import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Question, MockTest, StudyMaterial, SubjectId } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  FileText, 
  HelpCircle, 
  Award, 
  Users, 
  BarChart3,
  X
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, showToast, refreshUser } = useApp();
  
  const [activeAdminTab, setActiveAdminTab] = useState<'questions' | 'mock-tests' | 'materials' | 'overview'>('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // New Question Form Modal State
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newSubjectId, setNewSubjectId] = useState<SubjectId>('quantitative-aptitude');
  const [newTopic, setNewTopic] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newShortcutTrick, setNewShortcutTrick] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newPyqYear, setNewPyqYear] = useState<number | undefined>(2024);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [qs, mocks, mats] = await Promise.all([
        api.getQuestions(),
        api.getMockTests(),
        api.getStudyMaterials()
      ]);
      setQuestions(qs);
      setMockTests(mocks);
      setMaterials(mats);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleAddQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newTopic || newOptions.some(o => !o.trim())) {
      showToast({ type: 'warning', message: 'Please fill in all options and question fields.' });
      return;
    }

    try {
      const created = await api.createQuestion({
        subjectId: newSubjectId,
        topic: newTopic,
        question: newQuestionText,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
        explanation: newExplanation || 'Standard SSC examination solution.',
        shortcutTrick: newShortcutTrick,
        difficulty: newDifficulty,
        pyqYear: newPyqYear,
        pyqExam: newPyqYear ? `SSC CGL ${newPyqYear}` : undefined
      });

      setQuestions(prev => [created, ...prev]);
      setShowAddQuestionModal(false);
      showToast({
        type: 'success',
        title: 'Question Added',
        message: 'The new question is now live in the practice drill and mock engine.'
      });

      // Reset form
      setNewQuestionText('');
      setNewOptions(['', '', '', '']);
      setNewExplanation('');
      setNewShortcutTrick('');
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to create question' });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      showToast({ type: 'info', message: 'Question removed from question bank.' });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to delete question' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2 max-w-6xl mx-auto">
      
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            SSC CGL Academic Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Manage question banks, edit test parameters, publish study materials, and monitor platform performance.
          </p>
        </div>

        <button
          onClick={() => setShowAddQuestionModal(true)}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('questions')}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'questions'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500'
          }`}
        >
          Questions Repository ({questions.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('mock-tests')}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'mock-tests'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500'
          }`}
        >
          Mock Test Packages ({mockTests.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('materials')}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'materials'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500'
          }`}
        >
          Study Capsules ({materials.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500'
          }`}
        >
          Platform Analytics
        </button>
      </div>

      {/* Questions Manager */}
      {activeAdminTab === 'questions' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              All Questions in Master Bank
            </h3>
            <span className="text-xs text-slate-400">Total: {questions.length} questions</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {questions.map((q) => (
              <div key={q.id} className="py-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{q.subjectId}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{q.topic}</span>
                    <span>·</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                      {q.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="font-bold text-slate-900 dark:text-white leading-relaxed">{q.question}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`p-2 rounded-lg border ${i === q.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 font-bold text-emerald-800 dark:text-emerald-200' : 'border-slate-200 dark:border-slate-800'}`}>
                      {String.fromCharCode(65 + i)}: {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mock Tests Manager */}
      {activeAdminTab === 'mock-tests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTests.map((mock) => (
            <div key={mock.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{mock.type}</span>
                <span className="text-slate-400">{mock.attemptCount} attempts</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{mock.title}</h3>
              <p className="text-xs text-slate-500">{mock.description}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs font-semibold">
                <span>{mock.totalQuestions} Questions · {mock.durationMinutes} mins</span>
                <span className="text-emerald-600">Marks: {mock.totalMarks}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Platform Analytics Overview */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Aspirants</span>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">42,850</div>
            <p className="text-xs text-slate-400">Registered across 28 states</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Mock Attempts</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">118,400</div>
            <p className="text-xs text-slate-400">Avg Score: 138.2/200</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">AI Queries Resolved</span>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">64,200</div>
            <p className="text-xs text-slate-400">Gemini 3.8 Flash Solver</p>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Add Exam Question to Bank
              </h2>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value as SubjectId)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="quantitative-aptitude">Quantitative Aptitude</option>
                    <option value="reasoning">General Intelligence</option>
                    <option value="english">English Language</option>
                    <option value="general-awareness">General Awareness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Algebra / Syllogism"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Question Statement</label>
                <textarea
                  required
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Enter complete question statement..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold">4 Options (Select radio for Correct Answer)</label>
                {newOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={newCorrectAnswer === idx}
                      onChange={() => setNewCorrectAnswer(idx)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="font-bold w-4 text-center">{String.fromCharCode(65 + idx)}</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newOptions] as [string, string, string, string];
                        copy[idx] = e.target.value;
                        setNewOptions(copy);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold mb-1">Step-by-Step Explanation</label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Explain why the option is correct..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">15-Second Shortcut Trick (Optional)</label>
                <input
                  type="text"
                  value={newShortcutTrick}
                  onChange={(e) => setNewShortcutTrick(e.target.value)}
                  placeholder="e.g. Unit digit elimination or fraction trick"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
