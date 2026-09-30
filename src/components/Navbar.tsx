import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/currentUser';
import { 
  Flame, 
  Bell, 
  Moon, 
  Sun, 
  Search, 
  Menu, 
  X, 
  GraduationCap, 
  Sparkles, 
  User, 
  ShieldCheck, 
  LogOut, 
  Check, 
  Clock, 
  Layers
} from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, onOpenAuthModal }) => {
  const { 
    user, 
    isAuthenticated,
    logoutUser,
    theme, 
    toggleTheme, 
    notifications, 
    unreadNotifCount, 
    markNotifAsRead, 
    setActivePage, 
    refreshUser,
    showToast 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('practice');
    }
  };

  const handleToggleAdmin = async () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        await refreshUser();
        showToast({
          type: 'info',
          title: `Switched to ${newRole === 'admin' ? 'Admin Mode' : 'Student Mode'}`,
          message: newRole === 'admin' ? 'You now have access to the Admin Dashboard!' : 'Returned to Student View.'
        });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to switch role' });
    }
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                SSC CGL Portal
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  2026-27
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Staff Selection Commission Preparation
              </p>
            </div>
          </button>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search syllabus, formulas, shortcuts, PYQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 rounded-full text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </form>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Preparation Streak Badge */}
          {user && (
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold"
              title="Daily Active Preparation Streak"
            >
              <Flame className="w-4 h-4 text-amber-500 animate-pulse fill-amber-500" />
              <span>{user.streak}d streak</span>
            </div>
          )}

          {/* Quick AI Tutor Action */}
          <button
            onClick={() => setActivePage('ai-tutor')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Tutor</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                  </div>
                  {unreadNotifCount > 0 && (
                    <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                      {unreadNotifCount} unread
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotifAsRead(n.id)}
                        className={`p-3.5 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                          !n.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {(user.name || currentUser.name).charAt(0)}
                </div>
                <div className="text-left hidden md:block leading-tight pr-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                    {user.name || currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block -mt-0.5">
                    {user.role === 'admin' ? 'Admin' : 'Student'}
                  </span>
                </div>
                {user.role === 'admin' && (
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-300/40">
                    Admin
                  </span>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name || currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email || currentUser.email}</p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
                      Target: SSC CGL {user.targetExamYear || currentUser.targetExamYear}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActivePage('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Stats</span>
                    </button>

                    <button
                      onClick={() => {
                        setActivePage('daily-planner');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Daily Study Plan</span>
                    </button>

                    <button
                      onClick={handleToggleAdmin}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      <span>Switch to {user.role === 'admin' ? 'Student View' : 'Admin Mode'}</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
                    <button
                      onClick={async () => {
                        setShowUserMenu(false);
                        await logoutUser();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('login')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setActivePage('register')}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
