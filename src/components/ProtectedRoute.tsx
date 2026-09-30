import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Lock, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin';
  pagePath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'student',
  pagePath
}) => {
  const { isAuthenticated, currentUser, isLoading, setRedirectAfterLogin } = useAuth();
  const { setActivePage, showToast } = useApp();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (pagePath) {
        setRedirectAfterLogin(pagePath);
      }
      showToast({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in to access your SSC CGL preparation workspace.'
      });
      setActivePage('login');
    }
  }, [isLoading, isAuthenticated, pagePath]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Verifying preparation session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Student Authentication Required
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            This module is reserved for registered aspirants. Sign in or register to track your streak, access real-time mock tests, and review performance analytics.
          </p>
          <button
            onClick={() => setActivePage('login')}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Go to Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole === 'admin' && currentUser?.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Administrator Access Restricted
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You are logged in as a student (<span className="font-semibold text-slate-900 dark:text-white">{currentUser?.name}</span>). Administrative privileges are required to access syllabus management and mock test controls.
          </p>
          <button
            onClick={() => setActivePage('dashboard')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer"
          >
            Return to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
