import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/currentUser';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Monitor, 
  Lock, 
  User, 
  Save, 
  Check, 
  Download, 
  Trash2, 
  Languages, 
  Clock,
  ShieldCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, showToast } = useApp();

  // Settings State
  const [defaultLanguage, setDefaultLanguage] = useState<'English' | 'Hindi'>('English');
  const [timerAlertMins, setTimerAlertMins] = useState<number>(5);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(false);

  const [dailyReminder, setDailyReminder] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('09:00');
  const [currentAffairsAlert, setCurrentAffairsAlert] = useState<boolean>(true);
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(true);

  const [targetYear, setTargetYear] = useState<string>(user?.targetExamYear || '2026');
  const [targetPost, setTargetPost] = useState<string>('Assistant Section Officer (MEA)');
  const [category, setCategory] = useState<string>('UR (Unreserved)');
  const [hideFromLeaderboard, setHideFromLeaderboard] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    showToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Your portal and examination settings have been successfully updated.'
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast({ type: 'error', message: 'Please enter both current and new password.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    showToast({
      type: 'success',
      title: 'Password Updated',
      message: 'Your account security credentials were changed successfully.'
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExportData = () => {
    const exportPayload = {
      user: user?.name || currentUser.name,
      email: user?.email || currentUser.email,
      targetYear,
      targetPost,
      category,
      accuracy: user?.accuracy || 78.4,
      questionsSolved: user?.questionsSolved || 1420,
      mockTestsCompleted: user?.mockTestsCompleted || 14,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ssc_cgl_study_record_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'info',
      title: 'Study Data Exported',
      message: 'Your performance record was downloaded successfully.'
    });
  };

  return (
    <div className="space-y-6 py-2 max-w-5xl mx-auto">
      
      {/* 1. Header */}
      <div>
        <div className="text-xs font-semibold text-[#2563EB]">
          Portal Configuration & User Preferences
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-0.5">
          Settings
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage your computer-based test preferences, notification schedule, and account credentials.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Section 1: Examination & Test Interface */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <Monitor className="w-4 h-4 text-[#2563EB]" />
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">
                Examination & CBT Interface Settings
              </h2>
              <p className="text-xs text-[#64748B]">
                Configure how mock tests and quiz questions behave during examination sessions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            {/* Default Question Language */}
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">
                Default Examination Language
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="English">English (Standard Paper)</option>
                <option value="Hindi">Hindi (हिंदी अनुवाद)</option>
              </select>
              <p className="text-[11px] text-[#64748B] mt-1">
                You can toggle languages individually on any question during test.
              </p>
            </div>

            {/* Timer Alert Threshold */}
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">
                Timer Low-Time Alert Threshold
              </label>
              <select
                value={timerAlertMins}
                onChange={(e) => setTimerAlertMins(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value={3}>3 Minutes Remaining</option>
                <option value={5}>5 Minutes Remaining (Recommended)</option>
                <option value={10}>10 Minutes Remaining</option>
              </select>
              <p className="text-[11px] text-[#64748B] mt-1">
                The countdown timer flashes amber/red when this threshold is reached.
              </p>
            </div>

            {/* Auto Advance Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <div className="font-semibold text-[#0F172A]">Auto-Advance on Save</div>
                <div className="text-[11px] text-[#64748B]">
                  Automatically jump to next question after clicking "Save & Next"
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB] cursor-pointer"
              />
            </div>

            {/* Timer Sound Notification Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <div className="font-semibold text-[#0F172A]">Acoustic Warning Bell</div>
                <div className="text-[11px] text-[#64748B]">
                  Play subtle chime when 5 minutes remain in full mock tests
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB] cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Section 2: Study Reminders & Notifications */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <Bell className="w-4 h-4 text-[#2563EB]" />
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">
                Study Plan Reminders & Notifications
              </h2>
              <p className="text-xs text-[#64748B]">
                Control daily practice alerts and revision notifications
              </p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            
            {/* Daily Mock Reminder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <div className="font-semibold text-[#0F172A]">Daily Study Session Reminder</div>
                <div className="text-[11px] text-[#64748B]">
                  Prompt reminder to complete today's scheduled syllabus tasks
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  disabled={!dailyReminder}
                  className="p-1.5 text-xs rounded border border-[#E2E8F0] bg-white text-[#0F172A] disabled:opacity-50"
                />
                <input
                  type="checkbox"
                  checked={dailyReminder}
                  onChange={(e) => setDailyReminder(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB] cursor-pointer"
                />
              </div>
            </div>

            {/* Current Affairs Notification */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <div className="font-semibold text-[#0F172A]">Daily Current Affairs Digest</div>
                <div className="text-[11px] text-[#64748B]">
                  Receive 5-point national and international news summaries every morning
                </div>
              </div>
              <input
                type="checkbox"
                checked={currentAffairsAlert}
                onChange={(e) => setCurrentAffairsAlert(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB] cursor-pointer"
              />
            </div>

            {/* Weekly Performance Report Email */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <div className="font-semibold text-[#0F172A]">Weekly Diagnostic Performance Report</div>
                <div className="text-[11px] text-[#64748B]">
                  Receive weekly accuracy analysis, weak topics breakdown, and rank trajectory
                </div>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB] cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Section 3: Aspirant Target & Leaderboard Privacy */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <User className="w-4 h-4 text-[#2563EB]" />
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">
                Target Exam & Candidate Category
              </h2>
              <p className="text-xs text-[#64748B]">
                Used for calibrating cutoff benchmarks and comparative all-India percentiles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">
                Target Exam Year
              </label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="2026">SSC CGL 2026</option>
                <option value="2027">SSC CGL 2027</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">
                Candidate Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="UR (Unreserved)">UR (Unreserved)</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">
                Dream Post Preference
              </label>
              <select
                value={targetPost}
                onChange={(e) => setTargetPost(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Assistant Section Officer (MEA)">ASO in Ministry of External Affairs</option>
                <option value="Income Tax Inspector (CBDT)">Income Tax Inspector (CBDT)</option>
                <option value="Central Excise / GST Inspector (CBIC)">GST & Central Excise Inspector</option>
                <option value="Assistant Enforcement Officer (ED)">Assistant Enforcement Officer (ED)</option>
                <option value="Sub-Inspector (CBI)">Sub-Inspector (CBI)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs">
            <div>
              <div className="font-semibold text-[#0F172A]">Leaderboard Anonymity</div>
              <div className="text-[11px] text-[#64748B]">
                Display your mock scores on the public aspirant leaderboard as "Anonymous Aspirant"
              </div>
            </div>
            <input
              type="checkbox"
              checked={hideFromLeaderboard}
              onChange={(e) => setHideFromLeaderboard(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB] cursor-pointer"
            />
          </div>
        </div>

        {/* Section 4: Security Credentials */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <Lock className="w-4 h-4 text-[#2563EB]" />
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">
                Account Security & Password
              </h2>
              <p className="text-xs text-[#64748B]">
                Update your account password and security credentials
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1.5">
                Confirm New Password
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white font-semibold transition-colors shrink-0 cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Section 5: Data Export & Save All Changes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export Study Record (JSON)</span>
            </button>
          </div>

          <button
            onClick={handleSavePreferences}
            className="px-5 py-2.5 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
