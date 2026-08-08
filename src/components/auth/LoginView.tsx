'use client';

import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ShieldAlert, KeyRound, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginView: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('talk2icedmist@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [displayName, setDisplayName] = useState('Snow (Icedmist)');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('Please enter your full name');
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (presetEmail: string, presetName: string) => {
    setEmail(presetEmail);
    setPassword('Password123!');
    setDisplayName(presetName);
    setLoading(true);
    try {
      await signInWithEmail(presetEmail, 'Password123!');
    } catch (err: any) {
      setError(err?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1A1A2E] text-[#F5F5F5] font-sans flex items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#E85D04] selection:text-white">
      {/* Dynamic Background Glow & Grid */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#0099CC]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Branding & Info */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="Alpha Spark Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[#E85D04]/30 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E85D04]">
                AminApps Platform OS
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase italic leading-tight">
              Alpha Spark <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D04] via-[#F4A261] to-[#0099CC]">
                Workspace Gateway
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Central executive operational workspace. Sign in to access real-time task allocation, directorate telemetry, meeting intelligence, and super admin controls.
            </p>
          </div>

          {/* Key Security Badges */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="p-2 rounded-xl bg-[#E85D04]/20 text-[#E85D04]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Super Admin Security Protocol</h4>
                <p className="text-[11px] text-slate-400">Strict role enforcement & real-time Firestore access control</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="p-2 rounded-xl bg-[#0099CC]/20 text-[#0099CC]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Workspace State</h4>
                <p className="text-[11px] text-slate-400">Direct sync with persistent workspace database & local fallback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-6">
          <div className="relative bg-[#1A1A2E]/90 border border-[#E85D04]/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {/* Form Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-white tracking-tight uppercase italic">
                  {isSignUp ? 'Create Workspace Profile' : 'Workspace Sign In'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your executive credentials to continue
                </p>
              </div>
            </div>

            {/* Quick Super Admin Login Pre-sets */}
            <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#E85D04]/10 via-[#0099CC]/10 to-transparent border border-[#E85D04]/30">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#E85D04] uppercase tracking-wider">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Pre-Seeded Super Admin Credentials</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('talk2icedmist@gmail.com', 'Snow (Icedmist)')}
                  className="px-3 py-2 bg-[#E85D04]/20 hover:bg-[#E85D04]/30 border border-[#E85D04]/40 rounded-xl text-xs font-bold text-white text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ShieldAlert className="w-4 h-4 text-[#E85D04] shrink-0" />
                    <span className="truncate">Super Admin</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('fatima@alphaspark.org', 'Fatima Al-Hassan')}
                  className="px-3 py-2 bg-[#0099CC]/20 hover:bg-[#0099CC]/30 border border-[#0099CC]/40 rounded-xl text-xs font-bold text-white text-left transition flex items-center justify-between group"
                >
                  <span className="truncate">Directorate Lead</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Snow (Icedmist)"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="talk2icedmist@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg glow-orange transition"
              >
                {loading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create & Access Workspace' : 'Sign In To Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-[#1A1A2E] text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                Or continue with
              </span>
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
                />
              </svg>
              Google Identity System
            </button>

            <div className="mt-5 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-[#0099CC] hover:underline font-semibold"
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have a profile? Register New Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
