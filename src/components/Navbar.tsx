import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/currentUser';
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  GraduationCap,
  ShieldCheck, 
  LogOut,
  Settings as SettingsIcon,
  ChevronDown,
  CheckCircle2,
  Calendar,
  X,
  Award,
  Sparkles
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
      showToast({
        type: 'info',
        title: 'Search',
        message: `Searching questions and topics for "${searchQuery.trim()}"`
      });
      setActivePage('practice');
    }
  };

  const displayName = user?.name || currentUser.name;
  const displayEmail = user?.email || currentUser.email;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#E2E8F0] bg-white transition-colors shrink-0">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Section: Mobile Menu Trigger, Brand Logo & Exam Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none cursor-pointer transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clean Brand Header */}
          <button
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-500 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-slate-900 leading-tight">
                  SSC CGL
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  2025
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium leading-none block">
                PREPARATION PORTAL
              </span>
            </div>
          </button>

          {/* Quick Exam Target indicator visible on large screens */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/60 ml-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-bold text-blue-900 tracking-tight">
              Tier-I Focus
            </span>
          </div>
        </div>

        {/* Center Section: Global Search Box */}
        <div className="flex-1 max-w-xl mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, or anything..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
            />
          </form>
        </div>

        {/* Right Section: Notifications + User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick AI Doubt Support Button */}
          <button
            onClick={() => setActivePage('ai-tutor')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Open AI Doubt Support Center"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Doubt Solver</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    <p className="text-[11px] text-slate-500">Exam alerts & study milestones</p>
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach(n => markNotifAsRead(n.id));
                        showToast({ type: 'info', message: 'All marked as read' });
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotifAsRead(n.id)}
                        className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          n.type === 'test' ? 'bg-amber-100 text-amber-600' :
                          n.type === 'achievement' ? 'bg-emerald-100 text-emerald-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setActivePage('daily-planner');
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                  >
                    View Study Reminders →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Area (when authenticated) or Sign In Button (when unauthenticated) */}
          {isAuthenticated ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                className="flex items-center gap-3 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                aria-label="User account menu"
              >
                {/* Profile Avatar */}
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ring-2 ring-blue-600/20">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                {/* Name & SSC CGL Aspirant Label */}
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
                    {displayName}
                  </div>
                  <div className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 leading-none mt-0.5">
                    <span>SSC CGL Aspirant</span>
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Header in Dropdown */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {displayName}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {displayEmail}
                        </div>
                        <div className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/50">
                          SSC CGL Aspirant
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActivePage('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActivePage('analytics');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-slate-400" />
                      <span>Performance Analytics</span>
                    </button>

                    <button
                      onClick={() => {
                        setActivePage('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-400" />
                      <span>Settings & Preferences</span>
                    </button>
                  </div>

                  {/* Logout Option */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={async () => {
                        setShowUserMenu(false);
                        await logoutUser();
                        setActivePage('landing');
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('login')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setActivePage('register')}
                className="hidden sm:inline-flex px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Register
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
