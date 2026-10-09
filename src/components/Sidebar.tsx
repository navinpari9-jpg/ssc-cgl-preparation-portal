import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Award, 
  CheckSquare, 
  History, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  Flame,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    activePage, 
    setActivePage, 
    user, 
    logoutUser,
    isSidebarCollapsed,
    toggleSidebarCollapse
  } = useApp();

  const [extraToolsOpen, setExtraToolsOpen] = React.useState(false);

  // Exact 9 primary navigation items specified by user
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'daily-planner', label: 'Study Plan', icon: CalendarDays, path: '/study-planner' },
    { 
      id: 'mock-tests', 
      label: 'Mock Tests', 
      icon: Award, 
      path: '/mock-tests',
      matchKeys: ['mock-tests', 'quiz', 'quiz-result']
    },
    { id: 'practice', label: 'Practice Questions', icon: CheckSquare, path: '/practice' },
    { id: 'pyq', label: 'Previous Year Papers', icon: History, path: '/pyq' },
    { id: 'study-materials', label: 'Notes & PDFs', icon: BookOpen, path: '/study-materials' },
    { 
      id: 'analytics', 
      label: 'Performance Analysis', 
      icon: BarChart3, 
      path: '/performance',
      matchKeys: ['analytics', 'performance'] 
    },
    { id: 'ai-tutor', label: 'Doubt Support', icon: MessageSquare, path: '/ai-tutor' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' }
  ];

  // Secondary prep utilities preserved so no existing functionality is lost
  const extraPrepItems = [
    { id: 'current-affairs', label: 'Current Affairs', icon: Layers },
    { id: 'ai-generator', label: 'AI Question Generator', icon: Sparkles },
    { id: 'leaderboard', label: 'Rank Leaderboard', icon: Trophy }
  ];

  const handleNav = (pageId: string) => {
    setActivePage(pageId);
    onCloseMobile();
  };

  const isItemActive = (item: typeof mainNavItems[0]) => {
    if (item.matchKeys) {
      return item.matchKeys.includes(activePage);
    }
    return activePage === item.id;
  };

  const streakDays = user?.streak || 5;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 z-50 md:z-20 h-screen bg-[#0F172A] border-r border-slate-800 text-slate-100 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none shadow-xl md:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <button
            onClick={() => handleNav('dashboard')}
            className={`flex items-center gap-3 text-left group cursor-pointer overflow-hidden ${
              isSidebarCollapsed ? 'justify-center w-full' : ''
            }`}
            title="SSC CGL Preparation Portal"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            
            {!isSidebarCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-tight text-white leading-tight">
                    SSC CGL
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    2025
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 tracking-wide block truncate">
                  PREPARATION PORTAL
                </span>
              </div>
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exam Focus Pill (When Expanded) */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-3 shrink-0">
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-200">
                    {streakDays} Day Streak
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Tier 1 Goal: 160+ Marks
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10">
                Active
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {!isSidebarCollapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </div>
          )}

          {mainNavItems.map(item => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left group relative ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 tracking-tight">
                    {item.label}
                  </span>
                )}

                {/* Subtle active indicator dot for collapsed mode */}
                {isSidebarCollapsed && active && (
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}

          {/* Secondary Exam Modules Dropdown / Section */}
          <div className="pt-2">
            {!isSidebarCollapsed ? (
              <div className="space-y-1">
                <button
                  onClick={() => setExtraToolsOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <span>More Resources</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      extraToolsOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {extraToolsOpen && (
                  <div className="space-y-1 pl-1 pt-1 border-l-2 border-slate-800 ml-3">
                    {extraPrepItems.map(tool => {
                      const ToolIcon = tool.icon;
                      const isToolActive = activePage === tool.id;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleNav(tool.id)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                            isToolActive
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <ToolIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{tool.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Icon shortcuts when collapsed
              <div className="pt-2 border-t border-slate-800 space-y-1">
                {extraPrepItems.map(tool => {
                  const ToolIcon = tool.icon;
                  const isToolActive = activePage === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleNav(tool.id)}
                      title={tool.label}
                      className={`w-full flex items-center justify-center py-2 rounded-xl transition-colors cursor-pointer ${
                        isToolActive
                          ? 'bg-blue-600/30 text-blue-400'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <ToolIcon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Area: Collapse Button */}
        <div className="p-3 border-t border-slate-800 bg-[#0B1120] shrink-0 space-y-2">
          {/* Desktop Collapse / Expand Toggle */}
          <div className="hidden md:flex items-center justify-between pt-1">
            {!isSidebarCollapsed && (
              <span className="text-[11px] text-slate-400 font-medium">
                Collapse View
              </span>
            )}
            <button
              onClick={toggleSidebarCollapse}
              className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'w-full flex justify-center' : ''
              }`}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
