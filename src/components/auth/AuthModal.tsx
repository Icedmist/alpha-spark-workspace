'use client';

import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, LogIn, ArrowRight, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('Please enter your name');
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (presetEmail: string, presetName: string) => {
    setEmail(presetEmail);
    setPassword('Password123!');
    setDisplayName(presetName);
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-md bg-[#1A1A2E]/95 border border-[#E85D04]/30 rounded-3xl p-8 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#E85D04]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#0099CC]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E85D04] to-[#F4A261] flex items-center justify-center text-white shadow-lg glow-orange">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white tracking-tight uppercase italic">
              {isSignUp ? 'Join Alpha Spark' : 'Sign In'}
            </h2>
            <p className="text-xs text-slate-400">
              AminApps Real Auth & Permissions Protocol
            </p>
          </div>
        </div>

        {/* Quick Super Admin Logins */}
        <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-[#E85D04]/10 to-[#0099CC]/10 border border-[#E85D04]/30">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#E85D04] uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Pre-Seeded Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('talk2icedmist@gmail.com', 'Snow (Icedmist)')}
              className="px-2.5 py-1.5 bg-[#E85D04]/20 hover:bg-[#E85D04]/30 border border-[#E85D04]/40 rounded-xl text-[11px] font-bold text-white text-left transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#E85D04]" />
              <span className="truncate">Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('fatima@alphaspark.org', 'Fatima Al-Hassan')}
              className="px-2.5 py-1.5 bg-[#0099CC]/20 hover:bg-[#0099CC]/30 border border-[#0099CC]/40 rounded-xl text-[11px] font-bold text-white text-left transition"
            >
              <span className="truncate">Directorate Lead</span>
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
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Workspace Profile' : 'Sign In To Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-[#1A1A2E] text-[10px] uppercase font-bold text-slate-500 tracking-widest">
            Or continue with
          </span>
        </div>

        <button
          onClick={handleGoogle}
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

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#0099CC] hover:underline font-semibold"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Register Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};
