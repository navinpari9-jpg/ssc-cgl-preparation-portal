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
  UserPlus
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, redirectAfterLogin, setRedirectAfterLogin } = useAuth();
  const { setActivePage, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      setEmailError('Please enter your registered email address.');
      isValid = false;
    } else if (trimmedEmail.length < 3) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your account password.');
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
          title: 'Sign In Successful',
          message: 'Welcome to your SSC CGL preparation dashboard.'
        });

        const targetPage = redirectAfterLogin ? pathToPage(redirectAfterLogin) : 'dashboard';
        setRedirectAfterLogin(null);
        setActivePage(targetPage || 'dashboard');
      } else {
        setFormError(result.error || 'Invalid credentials. If you are new, please register first.');
      }
    } catch {
      setFormError('Authentication service temporarily unavailable. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Column: Brand & Security Presentation */}
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
                    2026-2027
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  PREPARATION PORTAL
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Student & Aspirant Sign In
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in with your registered account credentials to resume full-length CBT mock tests, study materials, and AI doubt resolutions.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Aspirant Identity & Token Security</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time CBT Mock Tests with Negative Marking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gemini-Powered Instant Doubt Solver</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Session Tokens</span>
            </span>
            <span className="text-emerald-400 font-semibold">Protected</span>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Aspirant Workspace
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A] mt-1 tracking-tight">
                Sign In to Your Account
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Please enter your registered email and password to continue.
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
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your registered email address"
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
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
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
                  <span>Keep me signed in on this device</span>
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

          </div>

          {/* Bottom Footer: Register Link */}
          <div className="mt-8 pt-4 border-t border-slate-100 space-y-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-900 text-left flex items-start gap-2.5">
              <UserPlus className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">First time preparing here?</span>
                <p className="text-[11px] text-blue-800/80 mt-0.5">
                  Create a new aspirant account with your email and target exam cycle. Your test attempts and study analytics will be securely linked to your account.
                </p>
              </div>
            </div>

            <div className="pt-2 text-slate-600">
              Don't have an account yet?{' '}
              <button
                onClick={() => setActivePage('register')}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Register as New Aspirant →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
