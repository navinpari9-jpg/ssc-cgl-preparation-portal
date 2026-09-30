import React from 'react';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/currentUser';
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Award, 
  BarChart3, 
  Bot, 
  Sparkles, 
  FileText, 
  CalendarDays, 
  Globe2, 
  History, 
  Trophy, 
  UserCircle, 
  ShieldAlert, 
  Home,
  X,
  Target,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activePage, setActivePage, user, isAuthenticated, logoutUser } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core' },
    { id: 'subjects', label: 'Syllabus', icon: BookOpen, section: 'Core' },
    { id: 'practice', label: 'Practice', icon: HelpCircle, section: 'Core' },
    { id: 'mock-tests', label: 'Mock Tests', icon: Award, section: 'Core' },
    { id: 'analytics', label: 'Performance', icon: BarChart3, section: 'Core' },
    
    { id: 'ai-tutor', label: 'AI Tutor', icon: Bot, badge: 'Gemini', section: 'AI Assist' },
    { id: 'ai-generator', label: 'AI Question Generator', icon: Sparkles, badge: 'New', section: 'AI Assist' },
    
    { id: 'daily-planner', label: 'Study Planner', icon: CalendarDays, section: 'Preparation' },
    { id: 'study-materials', label: 'Study Materials', icon: FileText, section: 'Preparation' },
    { id: 'current-affairs', label: 'Current Affairs', icon: Globe2, section: 'Preparation' },
    { id: 'pyq', label: 'PYQs', icon: History, section: 'Preparation' },
    
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, section: 'Community' },
    { id: 'profile', label: 'Profile', icon: UserCircle, section: 'Community' },
    { id: 'landing', label: 'Home Overview', icon: Home, section: 'Community' }
  ];

  if (user?.role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin',
      icon: ShieldAlert,
      badge: 'Admin',
      section: 'System'
    });
  }

  const handleNavClick = (id: string) => {
    setActivePage(id);
    onCloseMobile();
  };

  const sections = Array.from(new Set(navItems.map(item => item.section)));

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80">
      
      {/* Target Exam Indicator */}
      <div className="p-4 mx-3 my-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-slate-800/80 dark:to-indigo-950/40 border border-blue-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold tracking-tight">
          <Target className="w-4 h-4 shrink-0" />
          <span>SSC CGL Tier-1 Target</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
          60 Mins · 100 Qs · 200 Marks
        </p>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {sections.map(section => {
          const items = navItems.filter(i => i.section === section);
          return (
            <div key={section} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section}
              </div>
              {items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Details */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <span>SSC CGL Portal v2.4</span>
          <button
            onClick={() => setActivePage('admin')}
            className={`text-[11px] hover:underline cursor-pointer ${
              user?.role === 'admin' 
                ? 'font-bold text-amber-600 dark:text-amber-400' 
                : 'text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {user?.role === 'admin' ? 'Admin Active' : 'Admin Panel'}
          </button>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => {
              onCloseMobile();
              logoutUser();
            }}
            className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/60 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out ({user?.name || currentUser.name})</span>
          </button>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-64 h-[calc(100vh-4rem)] sticky top-16 shrink-0 z-20">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 flex flex-col">
            <div className="absolute top-3.5 right-3 z-20">
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar for rapid one-thumb access */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-1.5 px-2">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activePage === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActivePage('practice')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activePage === 'practice' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          <span>Practice</span>
        </button>

        <button
          onClick={() => setActivePage('mock-tests')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activePage === 'mock-tests' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Award className="w-4 h-4 mb-0.5" />
          <span>Mock Tests</span>
        </button>

        <button
          onClick={() => setActivePage('ai-tutor')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activePage === 'ai-tutor' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Bot className="w-4 h-4 mb-0.5" />
          <span>AI Tutor</span>
        </button>

        <button
          onClick={() => setActivePage('analytics')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activePage === 'analytics' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Performance</span>
        </button>
      </nav>
    </>
  );
};
