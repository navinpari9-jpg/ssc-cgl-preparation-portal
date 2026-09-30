import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { 
  Flame, 
  Target, 
  Award, 
  HelpCircle, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Sparkles, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  Compass,
  Check
} from 'lucide-react';
import { TestAttemptResult, DailyStudyPlan, SubjectMetadata } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, setActivePage, setActiveSubjectFilter, setActiveTopicFilter, showToast } = useApp();
  const [recentAttempts, setRecentAttempts] = useState<TestAttemptResult[]>([]);
  const [studyPlan, setStudyPlan] = useState<DailyStudyPlan | null>(null);
  const [subjects, setSubjects] = useState<SubjectMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [attempts, plan, subs] = await Promise.all([
          api.getTestAttempts(),
          api.getStudyPlan(),
          api.getSubjects()
        ]);
        setRecentAttempts(attempts);
        setStudyPlan(plan);
        setSubjects(subs);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      const updated = await api.toggleStudyTask(taskId);
      setStudyPlan(updated);
      showToast({
        type: 'success',
        title: 'Task Updated',
        message: 'Daily study progress updated.'
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to update task' });
    }
  };

  const completedTasks = studyPlan?.schedule.filter(t => t.completed).length || 0;
  const totalTasks = studyPlan?.schedule.length || 0;
  const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const displayName = user?.name || currentUser.name;
  const displayStreak = user?.streak || currentUser.streak;
  const displayQuestionsSolved = (user?.questionsSolved || currentUser.questionsSolved).toLocaleString();
  const displayAccuracy = user?.accuracy || currentUser.accuracy;
  const displayMockTests = user?.mockTestsCompleted || currentUser.mockTestsCompleted;
  const displayStudyHours = user ? Math.round((user.totalStudyMinutes / 60) * 10) / 10 : currentUser.studyHours;

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 border border-indigo-800/40 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>SSC CGL Preparation Hub · Aspirant: {displayName}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {displayName}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Keep your preparation consistent and stay on track for SSC CGL.
              You have {totalTasks - completedTasks} study tasks scheduled for today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('practice')}
              className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Continue Practice</span>
            </button>

            <button
              onClick={() => setActivePage('mock-tests')}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Take Mock Test</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Today's Goal */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Today's Goal</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Study 3 hrs
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            {completedTasks} of {totalTasks} tasks done
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {displayStreak} <span className="text-xs font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            Active streak
          </div>
        </div>

        {/* Questions Solved */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Questions Solved</span>
            <HelpCircle className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {displayQuestionsSolved}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Target: 2,000 Qs
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {displayAccuracy}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Target: &gt; 80%
          </div>
        </div>

        {/* Mock Tests Completed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Mock Tests</span>
            <Award className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {displayMockTests}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Full Tier-1 & Sectional
          </div>
        </div>

        {/* Study Hours */}
        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Study Hours</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {displayStudyHours} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            Overall preparation
          </div>
        </div>

      </div>

      {/* Main Grid: Today's Tasks & Subject Quick Launchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Study Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Study Schedule & Goals
                </h2>
              </div>
              <button
                onClick={() => setActivePage('daily-planner')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Customize Plan
              </button>
            </div>

            {/* Daily Goal Progress Bar */}
            <div className="mb-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Daily Tasks Completion: {completedTasks} / {totalTasks}
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {taskProgressPercent}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${taskProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Task list */}
            <div className="space-y-2.5">
              {studyPlan?.schedule.map(task => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/60 opacity-75'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 hover:border-indigo-400 shadow-2xs'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                      task.completed
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {task.topic}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">{task.timeSlot}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{task.subjectName}</span>
                      <span>·</span>
                      <span>{task.taskType}</span>
                      <span>·</span>
                      <span>{task.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Sections Exploration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Syllabus Mastery by Subject
              </h2>
              <button
                onClick={() => setActivePage('subjects')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All Topics
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => {
                    setActiveSubjectFilter(sub.id);
                    setActivePage('subjects');
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {sub.name}
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                        {sub.weightageTier1}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {sub.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sub.topics.length} Syllabus Topics</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                      Practice <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: AI Doubt Assistance & Recent Mock Tests */}
        <div className="space-y-6">
          
          {/* AI Tutor Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-700/50 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Gemini SSC Tutor
                </h3>
                <p className="text-sm font-bold">Ask Any CGL Doubt</p>
              </div>
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed">
              Solve quantitative problems step-by-step, review English grammar rules, and learn shortcuts instantly.
            </p>

            <button
              onClick={() => setActivePage('ai-tutor')}
              className="w-full py-2 px-3 rounded-xl bg-white text-indigo-900 hover:bg-slate-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Doubt Solver</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recommended Practice Topics (Weak Areas) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Recommended Topics to Revise</span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Based on recent mock tests and difficulty weightage:
            </p>

            <div className="space-y-2">
              {[
                { name: 'Compound Interest', sub: 'Quantitative Aptitude', accuracy: '62%' },
                { name: 'Syllogism (Only a few)', sub: 'General Intelligence', accuracy: '68%' },
                { name: 'Error Detection (Subject-Verb)', sub: 'English Language', accuracy: '71%' },
                { name: 'Indian Constitution (Articles 32-51)', sub: 'General Awareness', accuracy: '65%' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveTopicFilter(item.name);
                    setActivePage('practice');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-indigo-400"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.sub}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{item.accuracy}</span>
                    <div className="text-[9px] text-slate-400">avg accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Mock Test History */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Mock Results
              </h3>
              <button
                onClick={() => setActivePage('analytics')}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Analytics
              </button>
            </div>

            {recentAttempts.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4">
                No mock test attempts recorded yet.
                <button
                  onClick={() => setActivePage('mock-tests')}
                  className="block mx-auto mt-2 text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  Start First Test →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentAttempts.slice(0, 3).map(att => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {att.testTitle}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {att.correctAnswers} Correct · {att.wrongAnswers} Wrong · {att.accuracyPercentage}% Acc
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {att.score > 0 ? `+${att.score}` : att.score}
                      </span>
                      <div className="text-[10px] text-slate-400">/ {att.maxScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
