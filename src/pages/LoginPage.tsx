import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp, pathToPage } from '../context/AppContext';
import { GoogleSignInModal } from '../components/GoogleSignInModal';
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
  const { login, loginWithFirebaseGoogle, redirectAfterLogin, setRedirectAfterLogin } = useAuth();
  const { setActivePage, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
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
    if (isSubmitting || isFirebaseLoading) return;

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

  const handleGoogleLogin = async () => {
    if (isSubmitting || isFirebaseLoading) return;
    setIsFirebaseLoading(true);
    setFormError('');

    try {
      const result = await loginWithFirebaseGoogle();
      if (result.success) {
        showToast({
          type: 'success',
          title: 'Google Sign In Successful',
          message: 'Welcome to your SSC CGL preparation dashboard.'
        });
        const targetPage = redirectAfterLogin ? pathToPage(redirectAfterLogin) : 'dashboard';
        setRedirectAfterLogin(null);
        setActivePage(targetPage || 'dashboard');
      } else {
        // Open Universal Google Sign-In dialog for any domain
        setShowGoogleModal(true);
      }
    } catch {
      setShowGoogleModal(true);
    } finally {
      setIsFirebaseLoading(false);
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
              <span>Firebase Auth & Encrypted Storage</span>
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

            {/* Firebase Google Auth Button */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isFirebaseLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isFirebaseLoading ? 'Verifying with Firebase...' : 'Continue with Google / Firebase'}</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                    Or sign in with registered email
                  </span>
                </div>
              </div>
            </div>

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
                    placeholder="Enter email address"
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
                    placeholder="Enter password"
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
                disabled={isSubmitting || isFirebaseLoading}
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
                  You need to register first before logging in. Your target exam schedule, test attempts, and study analytics will be securely linked to your account.
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

      <GoogleSignInModal 
        isOpen={showGoogleModal} 
        onClose={() => setShowGoogleModal(false)} 
        onSuccess={() => {
          const targetPage = redirectAfterLogin ? pathToPage(redirectAfterLogin) : 'dashboard';
          setRedirectAfterLogin(null);
          setActivePage(targetPage || 'dashboard');
        }}
      />
    </div>
  );
};
