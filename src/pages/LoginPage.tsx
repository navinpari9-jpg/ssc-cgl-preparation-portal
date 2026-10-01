import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp, pathToPage } from '../context/AppContext';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  Zap,
  UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, redirectAfterLogin, setRedirectAfterLogin } = useAuth();
  const { setActivePage, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickLoginRole, setQuickLoginRole] = useState<'student' | 'admin' | null>(null);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setFormError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Please enter your email or username.');
      isValid = false;
    } else if (trimmedEmail.length < 3) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    }

    return isValid;
  };

  const handleLoginSubmit = async (emailToSubmit: string, passwordToSubmit: string) => {
    setIsSubmitting(true);
    setFormError('');

    try {
      const result = await login({
        email: emailToSubmit.trim(),
        password: passwordToSubmit,
        rememberMe
      });

      if (result.success) {
        showToast({
          type: 'success',
          title: 'Sign In Successful',
          message: 'Welcome to your SSC CGL preparation dashboard.'
        });

        const targetPage = redirectAfterLogin ? pathToPage(redirectAfterLogin) : 'dashboard';
        setRedirectAfterLogin(null);
        setActivePage(targetPage || 'dashboard');
      } else {
        setFormError(result.error || 'Invalid credentials. You can use "demo123" with any account.');
      }
    } catch {
      setFormError('Authentication service temporarily unavailable. Please try again.');
    } finally {
      setIsSubmitting(false);
      setQuickLoginRole(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    await handleLoginSubmit(email, password);
  };

  // 1-Click instant demo login
  const handleQuickLogin = async (type: 'student' | 'admin') => {
    const credEmail = type === 'student' ? 'demo@example.com' : 'admin@sscportal.gov.in';
    const credPassword = type === 'student' ? 'demo123' : 'admin123';

    setEmail(credEmail);
    setPassword(credPassword);
    setEmailError('');
    setPasswordError('');
    setFormError('');
    setQuickLoginRole(type);

    await handleLoginSubmit(credEmail, credPassword);
  };

  const handleContinueAsGuest = () => {
    handleQuickLogin('student');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Column: Brand & Features Presentation */}
        <div className="md:col-span-5 bg-[#0F172A] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-white leading-tight">
                    SSC CGL
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    2025
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  PREPARATION PORTAL
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Welcome to Your Preparation Hub
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to resume full-length CBT mock tests, practice questions, and review sectional diagnostics.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100 Qs / 60 Mins CBT Examination Simulation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>5,000+ Verified Practice Questions & Solutions</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sectional Analytics & Qualifying Cutoff Benchmarks</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>SSC CGL Tier 1 & Tier 2 Portal</span>
            <span className="text-emerald-400 font-semibold">Live Ready</span>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Aspirant & Staff Login
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A] mt-1 tracking-tight">
                Sign In to Your Account
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your registered credentials or click a quick login demo below.
              </p>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="student@example.com or navinpari9@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 transition-all"
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] text-rose-600 mt-1">{emailError}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-900">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setActivePage('forgot-password')}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="•••••••• (default: demo123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[11px] text-rose-600 mt-1">{passwordError}</p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                  />
                  <span>Keep me signed in for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Demo Logins */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Instant 1-Click Access
                </span>
                <span className="text-[11px] text-blue-600 font-semibold">
                  Pre-configured
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student')}
                  disabled={isSubmitting}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-300 text-slate-900 text-left transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-slate-900 group-hover:text-blue-700">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Student Account</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      demo@example.com
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Login →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  disabled={isSubmitting}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-amber-50 hover:border-amber-300 text-slate-900 text-left transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-slate-900 group-hover:text-amber-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin Account</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      admin@sscportal.gov.in
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Login →
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Footer: Register & Continue as Guest */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-center text-xs">
            <div className="text-slate-600">
              Don't have an account yet?{' '}
              <button
                onClick={() => setActivePage('register')}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Register as New Aspirant
              </button>
            </div>

            <div>
              <button
                onClick={handleContinueAsGuest}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Continue to Dashboard as Guest Student →</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
