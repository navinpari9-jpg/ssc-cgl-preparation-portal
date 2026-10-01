import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Question, MockTest, StudyMaterial, SubjectId } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  FileText, 
  HelpCircle, 
  Award, 
  Users, 
  BarChart3,
  X
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, showToast } = useApp();
  
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
        message: 'The new question has been added to the master repository.'
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
    <div className="space-y-6 py-2 max-w-6xl mx-auto">
      
      {/* Admin Header */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#2563EB] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Management Console</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-0.5">
            Academic Operations & Repository
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage master questions, verify mock test configurations, and monitor student metrics.
          </p>
        </div>

        <button
          onClick={() => setShowAddQuestionModal(true)}
          className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('questions')}
          className={`py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'questions'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Questions Repository ({questions.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('mock-tests')}
          className={`py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'mock-tests'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Mock Test Series ({mockTests.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('materials')}
          className={`py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'materials'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Study Materials ({materials.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'overview'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Platform Metrics
        </button>
      </div>

      {/* Questions Manager */}
      {activeAdminTab === 'questions' && (
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Questions Master Bank
            </h3>
            <span className="text-xs text-[#64748B] tabular-nums">Total: {questions.length} questions</span>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {questions.map((q) => (
              <div key={q.id} className="py-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span className="font-semibold text-[#2563EB]">{q.subjectId}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#0F172A]">{q.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.difficulty}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-md text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="font-semibold text-[#0F172A] leading-relaxed">{q.question}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-md border ${
                        i === q.correctAnswer
                          ? 'bg-green-50 border-[#16A34A] font-semibold text-[#16A34A]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                      }`}
                    >
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
            <div key={mock.id} className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span className="font-semibold text-[#2563EB]">{mock.type}</span>
                <span className="tabular-nums">{mock.attemptCount} attempts</span>
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">{mock.title}</h3>
              <p className="text-xs text-[#64748B]">{mock.description}</p>
              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between text-xs font-semibold">
                <span className="text-[#64748B] tabular-nums">{mock.totalQuestions} Qs · {mock.durationMinutes} mins</span>
                <span className="text-[#16A34A] tabular-nums">{mock.totalMarks} Marks</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Materials Manager */}
      {activeAdminTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((m) => (
            <div key={m.id} className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#2563EB]">{m.category}</span>
                <span className="text-[11px] text-[#64748B] tabular-nums">{m.readTimeMinutes} min read</span>
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">{m.title}</h3>
              <p className="text-xs text-[#64748B] line-clamp-2">{m.summary}</p>
            </div>
          ))}
        </div>
      )}

      {/* Overview Analytics */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
            <span className="text-xs font-semibold text-[#64748B]">Total Aspirants</span>
            <div className="text-2xl font-bold text-[#0F172A] mt-1 tabular-nums">15,420</div>
            <span className="text-[11px] text-[#16A34A] font-medium">+420 this week</span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
            <span className="text-xs font-semibold text-[#64748B]">Mock Tests Taken</span>
            <div className="text-2xl font-bold text-[#2563EB] mt-1 tabular-nums">48,910</div>
            <span className="text-[11px] text-[#64748B]">Completed attempts</span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
            <span className="text-xs font-semibold text-[#64748B]">Question Bank Size</span>
            <div className="text-2xl font-bold text-[#0F172A] mt-1 tabular-nums">{questions.length}</div>
            <span className="text-[11px] text-[#64748B]">Verified questions</span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
            <span className="text-xs font-semibold text-[#64748B]">Average Platform Score</span>
            <div className="text-2xl font-bold text-[#16A34A] mt-1 tabular-nums">136.8</div>
            <span className="text-[11px] text-[#64748B]">Tier-1 UR Standard</span>
          </div>
        </div>
      )}

      {/* Modal: Add New Question */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-sm text-[#0F172A]">Add Question to Master Bank</h3>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value as SubjectId)}
                    className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                  >
                    <option value="quantitative-aptitude">Quantitative Aptitude</option>
                    <option value="reasoning">General Intelligence & Reasoning</option>
                    <option value="english">English Language</option>
                    <option value="general-awareness">General Awareness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Topic Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Percentage, Syllogisms"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    required
                    className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Question Text</label>
                <textarea
                  rows={3}
                  placeholder="Enter the complete question statement..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  required
                  className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {newOptions.map((opt, i) => (
                  <div key={i}>
                    <label className="block font-semibold text-[#0F172A] mb-1">
                      Option {String.fromCharCode(65 + i)}
                    </label>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + i)} content`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newOptions] as [string, string, string, string];
                        updated[i] = e.target.value;
                        setNewOptions(updated);
                      }}
                      required
                      className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Correct Answer</label>
                  <select
                    value={newCorrectAnswer}
                    onChange={(e) => setNewCorrectAnswer(Number(e.target.value))}
                    className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">PYQ Year (Optional)</label>
                  <input
                    type="number"
                    value={newPyqYear || ''}
                    onChange={(e) => setNewPyqYear(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="2024"
                    className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Step-by-Step Explanation</label>
                <textarea
                  rows={2}
                  placeholder="Explain the solution methodology..."
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Shortcut Trick (Optional)</label>
                <input
                  type="text"
                  placeholder="Exam shortcut or mental calculation trick"
                  value={newShortcutTrick}
                  onChange={(e) => setNewShortcutTrick(e.target.value)}
                  className="w-full p-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-md border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
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
