import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { GoogleSignInModal } from '../components/GoogleSignInModal';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  Check,
  ShieldCheck
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, loginWithFirebaseGoogle } = useAuth();
  const { setActivePage, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetYear, setTargetYear] = useState('2026-2027');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

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
      setPasswordError('Please enter a password.');
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
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
    if (isSubmitting || isFirebaseLoading) return;

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
          title: 'Account Registered Successfully',
          message: 'Your credentials have been securely stored. Welcome to SSC CGL Preparation.'
        });
        setActivePage('dashboard');
      } else {
        setFormError(result.error || 'Failed to create account. Please try again.');
      }
    } catch {
      setFormError('Registration request failed. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (isSubmitting || isFirebaseLoading) return;
    setIsFirebaseLoading(true);
    setFormError('');

    try {
      const result = await loginWithFirebaseGoogle();
      if (result.success) {
        showToast({
          type: 'success',
          title: 'Google Registration Complete',
          message: 'Welcome to your SSC CGL preparation portal.'
        });
        setActivePage('dashboard');
      } else {
        // Open Google account modal for any domain
        setShowGoogleModal(true);
      }
    } catch {
      setShowGoogleModal(true);
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-6 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-lg bg-[#2563EB] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>

          <div className="text-xs font-semibold text-[#2563EB]">
            Aspirant Registration (Required Before Login)
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Create Your Account
          </h1>
          <p className="text-xs text-[#64748B]">
            Register with your details to access full-length mock tests, practice banks, and AI mentor.
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Google / Firebase sign in */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting || isFirebaseLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{isFirebaseLoading ? 'Connecting to Firebase...' : 'Register with Google / Firebase'}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or register with email credentials
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            {nameError && (
              <p className="text-[11px] text-[#DC2626] mt-1">{nameError}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            {emailError && (
              <p className="text-[11px] text-[#DC2626] mt-1">{emailError}</p>
            )}
          </div>

          {/* Target Exam Year */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Target SSC CGL Exam Cycle
            </label>
            <select
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="2026-2027">SSC CGL 2026-2027 (Upcoming Cycle)</option>
              <option value="2027-2028">SSC CGL 2027-2028</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Password (minimum 4 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] text-[#DC2626] mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            {confirmPasswordError && (
              <p className="text-[11px] text-[#DC2626] mt-1">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isFirebaseLoading}
            className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-70"
          >
            <span>{isSubmitting ? 'Registering Account...' : 'Register as Aspirant'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
          Already have registered credentials?{' '}
          <button
            onClick={() => setActivePage('login')}
            className="font-semibold text-[#2563EB] hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>

      </div>

      <GoogleSignInModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={() => setActivePage('dashboard')}
      />
    </div>
  );
};
