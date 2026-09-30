import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  KeyRound, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Loader2,
  Info
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const { setActivePage, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; note?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setEmailError('');
    setSuccessInfo(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await forgotPassword(trimmedEmail);
      if (res.success) {
        setSuccessInfo({
          message: 'Password reset instructions have been sent.',
          note: res.note || 'Instructions have been dispatched to your registered address.'
        });
        showToast({
          type: 'success',
          title: 'Reset Link Dispatched',
          message: 'Password reset instructions have been sent to your registered email address.'
        });
      } else {
        setEmailError(res.message || 'Unable to process reset request. Please check email address.');
      }
    } catch (err) {
      setEmailError('Network error requesting password reset. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10">
        
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Account Recovery
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Forgot Password?
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Success State */}
        {successInfo ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{successInfo.message}</span>
              </div>
              <p className="text-emerald-700 dark:text-emerald-400/90 leading-relaxed pl-7">
                If an account with <span className="font-semibold text-slate-900 dark:text-white">{email}</span> exists, you will receive password reset instructions within a few minutes.
              </p>
            </div>

            {/* Backend Configuration Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide">
                <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Environment Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Password reset dispatch is simulated for preview. In production deployments, configure your email service provider credentials (<code className="font-mono text-indigo-600 dark:text-indigo-400">SMTP_HOST</code> or <code className="font-mono text-indigo-600 dark:text-indigo-400">SENDGRID_API_KEY</code>) to deliver live messages.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActivePage('login')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            <div>
              <label 
                htmlFor="forgot-email" 
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="navin.kumar@example.com"
                  aria-invalid={Boolean(emailError)}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    emailError 
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Instructions...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActivePage('login')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
