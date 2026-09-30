import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { Question, StudyMaterial } from '../types';
import { 
  UserCircle, 
  Award, 
  Flame, 
  Clock, 
  Bookmark, 
  Target, 
  Settings, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  FileText,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser, showToast, setActivePage } = useApp();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'bookmarks' | 'achievements' | 'settings'>('stats');
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState<StudyMaterial[]>([]);
  
  // Settings Form
  const [name, setName] = useState(user?.name || currentUser.name);
  const [email, setEmail] = useState(user?.email || currentUser.email);
  const [targetYear, setTargetYear] = useState(user?.targetExamYear || currentUser.targetExamYear);
  const [targetTier, setTargetTier] = useState<'Tier-1' | 'Tier-2'>(user?.targetTier || currentUser.targetTier);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setTargetYear(user.targetExamYear);
      setTargetTier(user.targetTier);
    }
  }, [user]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const [allQs, allMats] = await Promise.all([
          api.getQuestions(),
          api.getStudyMaterials()
        ]);
        if (user) {
          setBookmarkedQuestions(allQs.filter(q => user.bookmarkedQuestionIds.includes(q.id)));
          setBookmarkedMaterials(allMats.filter(m => user.bookmarkedMaterialIds.includes(m.id)));
        }
      } catch (err) {
        console.error('Failed to load bookmarked items:', err);
      }
    };
    loadBookmarks();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateUserProfile({
        name,
        email,
        targetExamYear: targetYear,
        targetTier
      });
      await refreshUser();
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal information has been successfully saved.'
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to update profile' });
    }
  };

  const displayName = user?.name || currentUser.name;
  const displayEmail = user?.email || currentUser.email;
  const displayRole = user?.role === 'admin' ? 'Admin' : currentUser.role;

  return (
    <div className="space-y-6 sm:space-y-8 py-2 max-w-5xl mx-auto">
      
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-indigo-800/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
            {displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{displayName}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {displayRole}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{displayEmail}</p>
            <p className="text-xs text-indigo-300 font-medium mt-1">
              Target Exam: SSC CGL ({user?.targetTier || currentUser.targetTier})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <span className="text-[10px] text-slate-300 block">Streak</span>
            <span className="text-lg font-black text-amber-300">{user?.streak || currentUser.streak} Days</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <span className="text-[10px] text-slate-300 block">Accuracy</span>
            <span className="text-lg font-black text-emerald-300">{user?.accuracy || currentUser.accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Preparation Stats
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Badges & Achievements ({user?.achievements.filter(a => a.unlockedAt).length || 3})
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bookmarks'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Saved Revision Items ({bookmarkedQuestions.length + bookmarkedMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Personal Information
        </button>
      </div>

      {/* TAB 1: Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Solved</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {(user?.questionsSolved || currentUser.questionsSolved).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">Questions in Drills</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Correct Answers</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {(user?.correctCount || currentUser.correctCount).toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Acc: {user?.accuracy || currentUser.accuracy}%</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mocks Attempted</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {user?.mockTestsCompleted || currentUser.mockTestsCompleted}
              </div>
              <span className="text-[11px] text-slate-400">Avg: {user?.averageScore || currentUser.averageScore}/200</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Study Time</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {user ? Math.round((user.totalStudyMinutes / 60) * 10) / 10 : currentUser.studyHours} hrs
              </div>
              <span className="text-[11px] text-slate-400">Focused Revision</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Preparation Roadmap Checklist
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { title: 'Quantitative Aptitude Arithmetic Formulas & Tricks', done: true },
                { title: 'General Intelligence Syllogism (Only a Few & Possibility cases)', done: true },
                { title: 'English 50 Golden Grammar Rules and 300 Idioms', done: true },
                { title: 'Indian Constitution Part III (Articles 12-35) Writs', done: true },
                { title: 'Attempt 18 Full-Length Tier-1 Mocks with -0.50 negative marking', done: true },
                { title: 'Previous Year Papers 2021-2024 Tier-1 Shift Review', done: true }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    item.done
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold'
                  }`}
                >
                  <span className={item.done ? 'line-through' : ''}>{item.title}</span>
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">In Progress</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Achievements */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(user?.achievements || []).map((ach) => {
            const isUnlocked = ach.unlockedAt !== null;

            return (
              <div
                key={ach.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        {ach.progress} / {ach.maxProgress}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{ach.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                  {isUnlocked ? `Earned on ${ach.unlockedAt}` : 'Complete tasks to unlock badge'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Saved Practice Questions ({bookmarkedQuestions.length})
            </h3>
            {bookmarkedQuestions.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No questions bookmarked yet. Click the bookmark icon during practice drills to save questions for revision.</p>
            ) : (
              <div className="space-y-3">
                {bookmarkedQuestions.map(q => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-indigo-600 dark:text-indigo-400">
                      <span>{q.topic}</span>
                      <span className="text-slate-400">{q.difficulty}</span>
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium">{q.question}</p>
                    <div className="text-[11px] text-slate-500">Correct: {q.options[q.correctAnswer]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Saved Study Materials ({bookmarkedMaterials.length})
            </h3>
            {bookmarkedMaterials.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No study materials saved yet.</p>
            ) : (
              <div className="space-y-3">
                {bookmarkedMaterials.map(m => (
                  <div key={m.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white">{m.title}</div>
                    <p className="text-slate-500">{m.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Personal Information / Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleUpdateProfile} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Preparation Goal
              </label>
              <input
                type="text"
                readOnly
                value="SSC CGL"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-default"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Exam
              </label>
              <input
                type="text"
                readOnly
                value="SSC CGL"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-default"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Exam Year
              </label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="2026-2027">SSC CGL 2026-2027 (Upcoming)</option>
                <option value="2027-2028">SSC CGL 2027-2028</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Stage
              </label>
              <select
                value={targetTier}
                onChange={(e) => setTargetTier(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Tier-1">Tier-1 (Preliminary 200 Marks)</option>
                <option value="Tier-2">Tier-2 (Mains 390 Marks)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

