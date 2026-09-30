import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { DailyStudyPlan, StudyTask, SubjectId } from '../types';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Target, 
  Sparkles, 
  Check, 
  Play, 
  AlertCircle, 
  BookOpen, 
  Plus 
} from 'lucide-react';

export const DailyStudyPlanPage: React.FC = () => {
  const { user, showToast, setActivePage } = useApp();
  const [studyPlan, setStudyPlan] = useState<DailyStudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form State for Customizing Plan
  const [targetDate, setTargetDate] = useState('2026-12-15');
  const [dailyHours, setDailyHours] = useState(4.5);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [weakSubjects, setWeakSubjects] = useState<SubjectId[]>(['quantitative-aptitude']);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const plan = await api.getStudyPlan();
      setStudyPlan(plan);
      setTargetDate(plan.examTargetDate);
      setDailyHours(plan.dailyHours);
      setLevel(plan.level);
      setWeakSubjects(plan.weakSubjects);
    } catch (err) {
      console.error('Failed to load study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      const updated = await api.toggleStudyTask(taskId);
      setStudyPlan(updated);
      showToast({
        type: 'success',
        title: 'Task Status Updated',
        message: 'Your daily study streak and task records are in sync.'
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to update task' });
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyPlan) return;

    // Generate dynamic schedule based on inputs
    const newTasks: StudyTask[] = [
      {
        id: `task-${Date.now()}-1`,
        timeSlot: '07:30 AM - 09:00 AM',
        subjectId: weakSubjects.includes('quantitative-aptitude') ? 'quantitative-aptitude' : 'reasoning',
        subjectName: weakSubjects.includes('quantitative-aptitude') ? 'Quantitative Aptitude' : 'Reasoning',
        topic: 'Speed Drill & Targeted Weak Topic (90 min)',
        taskType: 'Practice Drill',
        durationMinutes: 90,
        completed: false
      },
      {
        id: `task-${Date.now()}-2`,
        timeSlot: '09:30 AM - 10:30 AM',
        subjectId: 'english',
        subjectName: 'English Language',
        topic: '50 Vocab Words & Grammar Error Rules',
        taskType: 'Vocab / GK',
        durationMinutes: 60,
        completed: false
      },
      {
        id: `task-${Date.now()}-3`,
        timeSlot: '02:00 PM - 03:00 PM',
        subjectId: 'general-awareness',
        subjectName: 'General Awareness',
        topic: 'Indian Polity Articles & Static GK Capsule',
        taskType: 'Theory / Notes',
        durationMinutes: 60,
        completed: false
      },
      {
        id: `task-${Date.now()}-4`,
        timeSlot: '05:00 PM - 06:00 PM',
        subjectId: 'reasoning',
        subjectName: 'General Intelligence',
        topic: 'Syllogism & Number Series Practice',
        taskType: 'Practice Drill',
        durationMinutes: 60,
        completed: false
      },
      {
        id: `task-${Date.now()}-5`,
        timeSlot: '08:00 PM - 09:00 PM',
        subjectId: 'quantitative-aptitude',
        subjectName: 'All Sections',
        topic: 'Full Speed Sectional Mock Test & Error Diary Review',
        taskType: 'Mock Test',
        durationMinutes: 60,
        completed: false
      }
    ];

    try {
      const updated = await api.updateStudyPlan({
        examTargetDate: targetDate,
        dailyHours,
        level,
        weakSubjects,
        schedule: newTasks
      });
      setStudyPlan(updated);
      setIsEditing(false);
      showToast({
        type: 'success',
        title: 'Daily Study Plan Regenerated!',
        message: 'Your study timetable has been optimized for your target date and hours.'
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to update plan' });
    }
  };

  const completedCount = studyPlan?.schedule.filter(t => t.completed).length || 0;
  const totalCount = studyPlan?.schedule.length || 0;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 py-2 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-indigo-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <CalendarDays className="w-4 h-4 text-sky-400" />
            <span>Target SSC CGL Timetable · {user?.name || currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            Personalized Daily Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Aspirant: <span className="font-bold text-white">{user?.name || currentUser.name}</span> · Target Exam Date: <span className="font-bold text-amber-300">{studyPlan?.examTargetDate || 'Dec 2026'}</span> · Allocated: <span className="font-bold text-sky-300">{studyPlan?.dailyHours || 4.5} hrs/day</span>
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors shrink-0 cursor-pointer"
        >
          {isEditing ? 'Close Customizer' : 'Customize Target & Hours'}
        </button>
      </div>

      {/* Customizer Drawer */}
      {isEditing && (
        <form onSubmit={handleSavePlan} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            Configure Your Preparation Roadmap
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Exam Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Available Daily Hours
              </label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={2}>2 Hours (Working Professional)</option>
                <option value={4}>4 Hours (Dedicated Routine)</option>
                <option value={6}>6 Hours (Full-Time Aspirant)</option>
                <option value={8}>8 Hours (Intensive Sprint)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Preparation Stage
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Beginner">Beginner (Foundations First)</option>
                <option value="Intermediate">Intermediate (Speed & Practice)</option>
                <option value="Advanced">Advanced (Full Mock Focus)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Regenerate Daily Schedule
            </button>
          </div>
        </form>
      )}

      {/* Today's Schedule Execution Board */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Progress Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Today's Step-by-Step Study Tasks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Check off completed blocks to keep your streak intact.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {percentComplete}% Completed
              </span>
              <div className="text-[10px] text-slate-400">
                {completedCount} of {totalCount} sessions done
              </div>
            </div>

            <div className="w-20 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {studyPlan?.schedule.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/60 opacity-70'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 hover:border-indigo-400 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                    task.completed
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono font-medium">{task.timeSlot}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {task.taskType}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold mt-1 truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.topic}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{task.subjectName}</span>
                    <span>·</span>
                    <span>{task.durationMinutes} mins</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePage('practice');
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors shrink-0 hidden sm:flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-slate-700 dark:fill-slate-200" />
                <span>Launch</span>
              </button>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
