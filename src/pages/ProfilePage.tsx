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
  CheckCircle2, 
  HelpCircle, 
  FileText,
  Save,
  Check
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
        message: 'Your personal details have been saved.'
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to update profile' });
    }
  };

  const displayName = user?.name || currentUser.name;
  const displayEmail = user?.email || currentUser.email;

  return (
    <div className="space-y-6 py-2 max-w-5xl mx-auto">
      
      {/* 1. Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-xs">
            {displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0F172A]">{displayName}</h1>
              <span className="text-[11px] font-semibold text-[#2563EB]">
                Aspirant ({targetYear})
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">{displayEmail}</p>
            <p className="text-xs text-[#2563EB] font-medium mt-1">
              Target: SSC CGL Tier-1 Examination · {user?.targetTier || 'Tier-1 & Tier-2'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-center min-w-[90px]">
            <span className="text-[11px] text-[#64748B] block">Study Streak</span>
            <span className="text-base font-bold text-[#F59E0B] tabular-nums">
              {user?.streak || currentUser.streak} Days
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-center min-w-[90px]">
            <span className="text-[11px] text-[#64748B] block">Accuracy</span>
            <span className="text-base font-bold text-[#16A34A] tabular-nums">
              {user?.accuracy || currentUser.accuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Preparation Stats
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'bookmarks'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Saved Bookmarks ({bookmarkedQuestions.length + bookmarkedMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Achievements & Badges
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-4 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Candidate Information
        </button>
      </div>

      {/* TAB 1: Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
              <span className="text-xs font-semibold text-[#64748B]">Total Solved</span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1 tabular-nums">
                {(user?.questionsSolved || currentUser.questionsSolved).toLocaleString()}
              </div>
              <span className="text-[11px] text-[#64748B]">Questions in bank</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
              <span className="text-xs font-semibold text-[#64748B]">Correct Answers</span>
              <div className="text-2xl font-bold text-[#16A34A] mt-1 tabular-nums">
                {(user?.correctCount || currentUser.correctCount).toLocaleString()}
              </div>
              <span className="text-[11px] text-[#16A34A] font-medium">Accuracy: {user?.accuracy || currentUser.accuracy}%</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
              <span className="text-xs font-semibold text-[#64748B]">Mocks Attempted</span>
              <div className="text-2xl font-bold text-[#2563EB] mt-1 tabular-nums">
                {user?.mockTestsCompleted || currentUser.mockTestsCompleted}
              </div>
              <span className="text-[11px] text-[#64748B]">Avg: {user?.averageScore || 142.5}/200</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
              <span className="text-xs font-semibold text-[#64748B]">Total Study Time</span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1 tabular-nums">
                {user ? Math.round((user.totalStudyMinutes / 60) * 10) / 10 : 42.5} hrs
              </div>
              <span className="text-[11px] text-[#64748B]">Active prep</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A]">
              Syllabus Coverage Milestones
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { title: 'Quantitative Aptitude Arithmetic Formulas & Tricks', done: true },
                { title: 'General Intelligence Syllogism (Only a Few & Possibility cases)', done: true },
                { title: 'English 50 Golden Grammar Rules and 300 High-Frequency Vocab', done: true },
                { title: 'Indian Constitution Fundamental Rights (Articles 12-35) & Writs', done: true },
                { title: 'Attempt 10 Full-Length Tier-1 Mocks with -0.50 negative marking', done: true },
                { title: 'Previous Year Papers (2021-2024 Tier-1 Shift Review)', done: false }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between"
                >
                  <span className={`font-medium ${item.done ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                    {item.title}
                  </span>
                  {item.done ? (
                    <span className="text-[11px] text-[#16A34A] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#F59E0B] font-semibold">In Progress</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#0F172A]">
              Saved Practice Questions ({bookmarkedQuestions.length})
            </h3>
            {bookmarkedQuestions.length === 0 ? (
              <p className="text-xs text-[#64748B]">No bookmarked questions yet.</p>
            ) : (
              <div className="space-y-2">
                {bookmarkedQuestions.map(q => (
                  <div
                    key={q.id}
                    className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A]">{q.topic}</div>
                      <div className="text-[11px] text-[#64748B] line-clamp-1">{q.question}</div>
                    </div>
                    <button
                      onClick={() => setActivePage('practice')}
                      className="text-[#2563EB] font-semibold hover:underline shrink-0 ml-4 cursor-pointer"
                    >
                      Practice →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#0F172A]">
              Saved Study Materials ({bookmarkedMaterials.length})
            </h3>
            {bookmarkedMaterials.length === 0 ? (
              <p className="text-xs text-[#64748B]">No bookmarked materials yet.</p>
            ) : (
              <div className="space-y-2">
                {bookmarkedMaterials.map(m => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A]">{m.title}</div>
                      <div className="text-[11px] text-[#64748B] line-clamp-1">{m.summary}</div>
                    </div>
                    <button
                      onClick={() => setActivePage('study-materials')}
                      className="text-[#2563EB] font-semibold hover:underline shrink-0 ml-4 cursor-pointer"
                    >
                      Read Notes →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Achievements */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(user?.achievements || []).map((ach) => {
            const isUnlocked = ach.unlockedAt !== null;

            return (
              <div
                key={ach.id}
                className={`p-5 rounded-xl border flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-[#E2E8F0] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#0F172A]">{ach.title}</span>
                    <span className="text-[11px] font-semibold text-[#16A34A]">
                      {isUnlocked ? 'Unlocked ✓' : `${ach.progress}/${ach.maxProgress}`}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: Candidate Information Form */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Candidate Profile Settings</h2>
            <p className="text-xs text-[#64748B]">Update your display name and target examination year.</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg text-xs">
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-slate-100 text-[#64748B] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">Target SSC CGL Year</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="2026">SSC CGL 2026</option>
                <option value="2027">SSC CGL 2027</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
