import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Home, ArrowLeft, ShieldAlert } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
        
        {/* Error Badge & Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>HTTP 404 · Error</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The requested address or resource is not accessible, does not exist, or has been restricted on this portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setActivePage('landing')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Student Dashboard</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          SSC CGL Examination Preparation Portal · Security Enforced
        </div>
      </div>
    </div>
  );
};
