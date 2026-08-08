'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  FolderKanban,
  User,
  CheckCircle2,
  AlertCircle,
  Code2,
  GraduationCap,
  Palette,
  Megaphone,
  Handshake,
  DollarSign,
  Users,
  Briefcase,
  ShieldCheck,
  } from 'lucide-react';
import { Directorate, User as UserType } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';

interface CreateDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserType[];
  isSuperAdmin: boolean;
  onDirectorateCreated: (directorate: Directorate) => void;
}

const ICON_OPTIONS = [
  { label: 'Code2', Icon: Code2 },
  { label: 'GraduationCap', Icon: GraduationCap },
  { label: 'Palette', Icon: Palette },
  { label: 'Megaphone', Icon: Megaphone },
  { label: 'Handshake', Icon: Handshake },
  { label: 'DollarSign', Icon: DollarSign },
  { label: 'Users', Icon: Users },
  { label: 'Briefcase', Icon: Briefcase },
  { label: 'ShieldCheck', Icon: ShieldCheck },
  { label: 'FolderKanban', Icon: FolderKanban },
];

const COLOR_OPTIONS = [
  '#3B82F6',
  '#10B981',
  '#EC4899',
  '#F59E0B',
  '#8B5CF6',
  '#06B6D4',
  '#EF4444',
  '#64748B',
  '#6366F1',
];

export const CreateDirectorateModal: React.FC<CreateDirectorateModalProps> = ({
  isOpen,
  onClose,
  users,
  isSuperAdmin,
  onDirectorateCreated,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [icon, setIcon] = useState('FolderKanban');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSuperAdmin) {
      setError('Access Denied: Only Super Admin or Directorate Leads can create new directorates.');
      return;
    }

    if (!name.trim() || !code.trim() || !description.trim()) {
      setError('Please fill in the name, code, and description.');
      return;
    }

    const newDirectorate: Directorate = {
      id: `dir-${Date.now()}`,
      workspaceId: 'ws-alpha-spark',
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      leadId: leadId || '',
      memberIds: leadId ? [leadId] : [],
      color,
      icon,
    };

    WorkspaceStorageService.addDirectorate(newDirectorate);
    onDirectorateCreated(newDirectorate);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setName('');
      setCode('');
      setDescription('');
      setLeadId('');
      setColor(COLOR_OPTIONS[0]);
      setIcon('FolderKanban');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-lg bg-[#1A1A2E]/95 border border-[#E85D04]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#E85D04]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#0099CC]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E85D04] to-[#F4A261] flex items-center justify-center text-white shadow-lg glow-orange">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white italic uppercase tracking-tight">
              Launch New Directorate
            </h2>
            <p className="text-xs text-slate-400">
              Administrative Privilege · Add a new workstream to the workspace
            </p>
          </div>
        </div>

        {!isSuperAdmin ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>
              Unauthorized: Only team leaders and super admins can create new directorates.
            </span>
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
                <span>Directorate spun up successfully!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Directorate Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Cybersecurity & Infosec"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. SEC"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white uppercase placeholder-slate-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Directorate Lead
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <select
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 appearance-none bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white focus:outline-none transition [&>option]:bg-[#1A1A2E] [&>option]:text-white"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Scope, mandate, and key workflows for this directorate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-[#E85D04] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand Icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map(({ label, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setIcon(label)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center transition ${
                      icon === label
                        ? 'bg-[#E85D04]/20 border-[#E85D04] text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Color Accent
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      color === c ? 'border-white scale-110' : 'border-white/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg glow-orange transition"
            >
              Spin Up Directorate
            </button>
          </form>
        )}
      </div>
    </div>
  );
};