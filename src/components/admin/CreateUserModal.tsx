'use client';

import React, { useState } from 'react';
import { X, UserPlus, Mail, User as UserIcon, Shield, Layers, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, Directorate, UserRole } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorates: Directorate[];
  onUserCreated: (newUser: User) => void;
  currentUser: User;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  directorates,
  onUserCreated,
  currentUser,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [selectedDirIds, setSelectedDirIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Strict Super Admin Check
  const isSuperAdmin = currentUser.role === 'super_admin' || currentUser.email.toLowerCase() === 'talk2icedmist@gmail.com';

  const toggleDirectorate = (dirId: string) => {
    if (selectedDirIds.includes(dirId)) {
      setSelectedDirIds(selectedDirIds.filter((id) => id !== dirId));
    } else {
      setSelectedDirIds([...selectedDirIds, dirId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSuperAdmin) {
      setError('Access Denied: Only Super Admins can provision new users.');
      return;
    }

    if (!displayName.trim() || !email.trim() || !title.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        workspaceId: 'ws-alpha-spark',
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        title: title.trim(),
        role: role,
        directorateIds: selectedDirIds.length > 0 ? selectedDirIds : ['dir-dev'],
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      };

      WorkspaceStorageService.saveUser(newUser);
      onUserCreated(newUser);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setDisplayName('');
        setEmail('');
        setTitle('');
        setRole('member');
        setSelectedDirIds([]);
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to provision user.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-lg bg-[#1A1A2E]/95 border border-[#E85D04]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Glow */}
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
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white italic uppercase tracking-tight">
              Provision Workspace User
            </h2>
            <p className="text-xs text-slate-400">
              Super Admin Privilege · Assign permissions & directorates
            </p>
          </div>
        </div>

        {!isSuperAdmin ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Unauthorized: Only Super Admin users can create and provision workspace members.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>User profile provisioned successfully!</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ibrahim Abubakar"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="ibrahim@alphaspark.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Job Title / Role */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Organizational Title *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Access Role */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Platform Permission Level *
              </label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white focus:outline-none transition"
                >
                  <option value="member">Workspace Member (Standard Access)</option>
                  <option value="directorate_lead">Directorate Lead (Workstream Manager)</option>
                  <option value="super_admin">Super Admin (Full Administrative Permission)</option>
                </select>
              </div>
            </div>

            {/* Assign Directorates */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#E85D04]" />
                Assign Workstream Directorates
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {directorates.map((dir) => {
                  const isChecked = selectedDirIds.includes(dir.id);
                  return (
                    <button
                      key={dir.id}
                      type="button"
                      onClick={() => toggleDirectorate(dir.id)}
                      className={`p-2 rounded-xl text-left border transition text-xs flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#E85D04]/20 border-[#E85D04] text-white'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate font-semibold">{dir.name}</span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border ${
                          isChecked ? 'bg-[#E85D04] border-[#E85D04]' : 'border-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg glow-orange transition"
            >
              Provision User Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
