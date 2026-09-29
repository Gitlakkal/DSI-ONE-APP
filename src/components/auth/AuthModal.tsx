import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Lock,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DsiLogo } from '../common/DsiLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    userProfile,
    signInWithEmail,
    createAccount,
    signOut,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotNote, setShowForgotNote] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setShowForgotNote(false);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await createAccount(email, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Top Right Close 'X' Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0B2545] border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Signed In to DSI Portal</h3>
              <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0B2545] border border-blue-200">
                Role: {userProfile?.role || 'Staff'}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close Window
              </button>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Top Centered Official DSI Logo */}
            <div className="flex justify-center mb-5">
              <DsiLogo size="md" showSubtitle={true} />
            </div>

            {/* Header Titles */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {mode === 'signin'
                  ? 'Enter your credentials to access your portal.'
                  : 'Enter your email and choose a password to register.'}
              </p>
            </div>

            {/* Two-Tab Navigation */}
            <div className="grid grid-cols-2 border-b border-slate-200/80 mb-6 relative">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                  setShowForgotNote(false);
                }}
                className={`pb-3 text-sm font-bold text-center transition-colors relative ${
                  mode === 'signin'
                    ? 'text-[#0B2545]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Sign In
                {mode === 'signin' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B2545] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                  setShowForgotNote(false);
                }}
                className={`pb-3 text-sm font-bold text-center transition-colors relative ${
                  mode === 'signup'
                    ? 'text-[#0B2545]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Sign Up
                {mode === 'signup' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B2545] rounded-full" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Forgot password note */}
            {showForgotNote && (
              <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-medium text-[#0B2545] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B2545] flex-shrink-0 mt-0.5" />
                <span>For password recovery or reset, please contact DSI IT Helpdesk at support@desertsides.com.</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/15 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotNote(!showForgotNote)}
                      className="text-xs font-semibold text-[#0B2545] hover:text-[#FF6B00] transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/15 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#0B2545] hover:bg-[#123966] text-white shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
              >
                <span>
                  {isLoading
                    ? 'Processing...'
                    : mode === 'signin'
                    ? 'Sign In'
                    : 'Sign Up'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider: OR CONTINUE WITH */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-200/80 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('Please use your official email & password credentials to sign in.');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
              >
                <svg className="w-4 h-4 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage('Google SSO is managed via your enterprise account. Please enter your email and password above.');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>
            </div>

            {/* Bottom Disclaimer */}
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              By continuing, you agree to Desert Sides International's{' '}
              <a href="#" className="font-semibold text-[#0B2545] hover:text-[#FF6B00] transition-colors underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-[#0B2545] hover:text-[#FF6B00] transition-colors underline">
                Privacy Policy
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
};
