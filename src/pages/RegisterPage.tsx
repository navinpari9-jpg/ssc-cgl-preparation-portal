import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Calendar,
  Loader2 
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { setActivePage, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetYear, setTargetYear] = useState('2026-2027');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFormError('');

    if (!name.trim()) {
      setNameError('Please enter your full name.');
      isValid = false;
    }

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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        targetExamYear: targetYear
      });

      if (result.success) {
        showToast({
          type: 'success',
          title: 'Account created successfully.',
          message: 'Welcome to SSC CGL Preparation Portal! Your study workspace is ready.'
        });
        setActivePage('dashboard');
      } else {
        setFormError(result.error || 'Failed to create account. Please try again.');
      }
    } catch (err: any) {
      setFormError('Registration request failed. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            SSC CGL Preparation Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Create Student Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Start your preparation journey with full syllabus coverage, mock tests & AI mentor.
          </p>
        </div>

        {/* Global Error Banner */}
        {formError && (
          <div 
            role="alert"
            className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-medium">{formError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label 
              htmlFor="register-name" 
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder="e.g. Navin Kumar"
                aria-invalid={Boolean(nameError)}
                className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                  nameError 
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>
            {nameError && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{nameError}</span>
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label 
              htmlFor="register-email" 
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="register-email"
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

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label 
                htmlFor="register-password" 
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Min 6 characters"
                  className={`w-full pl-9 pr-9 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    passwordError 
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                  {passwordError}
                </p>
              )}
            </div>

            <div>
              <label 
                htmlFor="register-confirm-password" 
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  placeholder="Re-enter password"
                  className={`w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    confirmPasswordError 
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {confirmPasswordError && (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                  {confirmPasswordError}
                </p>
              )}
            </div>
          </div>

          {/* Target Exam Year */}
          <div>
            <label 
              htmlFor="register-target-year" 
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
            >
              Target Examination Cycle
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                id="register-target-year"
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="2026-2027">SSC CGL 2026-2027 (Upcoming Cycle)</option>
                <option value="2027-2028">SSC CGL 2027-2028 (Next Cycle)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed pt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Existing account login redirect */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setActivePage('login')}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
