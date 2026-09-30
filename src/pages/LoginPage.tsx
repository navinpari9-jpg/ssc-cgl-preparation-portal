import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Award, 
  Bot, 
  BarChart3, 
  Target,
  Sparkles,
  Loader2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, redirectAfterLogin, setRedirectAfterLogin } = useAuth();
  const { setActivePage, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Field-specific validation errors
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
      setEmailError('Please enter your email address.');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError('Please enter a valid email address.');
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const result = await login({
        email: email.trim(),
        password,
        rememberMe
      });

      if (result.success) {
        showToast({
          type: 'success',
          title: 'Welcome back, Navin Kumar!',
          message: 'Authentication successful. Your SSC CGL preparation workspace is ready.'
        });

        const targetPage = redirectAfterLogin ? redirectAfterLogin.replace('/', '') : 'dashboard';
        setRedirectAfterLogin(null);
        setActivePage(targetPage || 'dashboard');
      } else {
        setFormError(result.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setFormError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo account quick autofill
  const handleFillDemo = (type: 'student' | 'admin') => {
    if (type === 'student') {
      setEmail('demo@example.com');
      setPassword('demo123');
      setEmailError('');
      setPasswordError('');
      setFormError('');
    } else {
      setEmail('admin@sscportal.gov.in');
      setPassword('admin123');
      setEmailError('');
      setPasswordError('');
      setFormError('');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Educational Branding & Platform Features */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-indigo-800/40">
          <div className="relative z-10 space-y-6">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight leading-tight">
                  SSC CGL Preparation Portal
                </h2>
                <span className="text-[11px] font-semibold text-indigo-300">
                  Staff Selection Commission · 2026-27
                </span>
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-1.5 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold backdrop-blur-md border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Premier Competitive Exam Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Prepare Smarter.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">
                  Score Better.
                </span>
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Access comprehensive study materials, realistic full-length Tier-1 mock tests, AI-powered doubt solving, and diagnostic analytics designed specifically for SSC CGL aspirants.
              </p>
            </div>

            {/* Platform Feature Badges */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block">50+ Syllabus Topics</span>
                  <span className="text-[11px] text-slate-400">Quantitative, Reasoning, English & GA</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block">NTA/SSC Exam Simulator</span>
                  <span className="text-[11px] text-slate-400">60-minute timer, palette & -0.50 marking</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-purple-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block">Gemini 3.8 Flash AI Mentor</span>
                  <span className="text-[11px] text-slate-400">Step-by-step solutions & 15-second shortcut tricks</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block">Diagnostic Analytics</span>
                  <span className="text-[11px] text-slate-400">National percentile rank & weak-area roadmaps</span>
                </div>
              </div>
            </div>

          </div>

          {/* Aspirant Status Footer */}
          <div className="relative z-10 pt-6 mt-6 border-t border-indigo-800/60 text-xs text-slate-400 flex items-center justify-between">
            <span>Over 15,000+ active aspirants</span>
            <span className="font-semibold text-indigo-300">Tier-1 & Tier-2</span>
          </div>

          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        </div>

        {/* Right Column: Login Form & Demo Accounts */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Aspirant Authentication
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Student & Aspirant Login
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials to access your personalized SSC CGL dashboard.
              </p>
            </div>

            {/* Error Banner */}
            {formError && (
              <div 
                role="alert"
                className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span className="font-medium">{formError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label 
                  htmlFor="login-email" 
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="navin.kumar@example.com"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'login-email-error' : undefined}
                    className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      emailError 
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {emailError && (
                  <p id="login-email-error" className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="login-password" 
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setActivePage('forgot-password')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? 'login-password-error' : undefined}
                    className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      passwordError 
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p id="login-password-error" className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Login Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Create Account Link */}
            <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setActivePage('register')}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>

            {/* Development / Demo Login Box */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Development / Demo Accounts (Demo Only)</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-300/40">
                  Demo Credentials
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Student Demo Account */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Demo Student
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Navin Kumar
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono space-y-0.5">
                    <div>Email: <span className="text-slate-700 dark:text-slate-300 font-semibold">demo@example.com</span></div>
                    <div>Pass: <span className="text-slate-700 dark:text-slate-300 font-semibold">demo123</span></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('student')}
                    className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold transition-colors text-center"
                  >
                    Fill Demo Student
                  </button>
                </div>

                {/* Admin Demo Account */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Demo Admin
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      Admin Console
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono space-y-0.5">
                    <div>Email: <span className="text-slate-700 dark:text-slate-300 font-semibold">admin@sscportal.gov.in</span></div>
                    <div>Pass: <span className="text-slate-700 dark:text-slate-300 font-semibold">admin123</span></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin')}
                    className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold transition-colors text-center"
                  >
                    Fill Demo Admin
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Footer note */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>Official SSC CGL Examination Syllabus Guidelines</span>
            <button
              type="button"
              onClick={() => setActivePage('landing')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Back to Home Overview
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
