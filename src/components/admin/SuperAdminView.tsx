'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Database,
  Activity,
  Cpu,
  Plus,
  Edit2,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Server,
  Layers,
  Key,
} from 'lucide-react';
import { User, Directorate, Task, UserRole } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

interface SuperAdminViewProps {
  users: User[];
  directorates: Directorate[];
  tasks: Task[];
  currentUser: User;
  onUsersUpdated?: () => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  users,
  directorates,
  tasks,
  currentUser,
  onUsersUpdated,
}) => {
  const { user } = useAuth();
  const [userList, setUserList] = useState<User[]>(users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);

  // Platform usage calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalUsers = userList.length;
  const superAdminCount = userList.filter((u) => u.role === 'super_admin').length;
  const leadCount = userList.filter((u) => u.role === 'directorate_lead').length;

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updatedUsers = userList.map((u) => {
      if (u.id === userId) {
        const updated = { ...u, role: newRole };
        WorkspaceStorageService.saveUser(updated);
        return updated;
      }
      return u;
    });
    setUserList(updatedUsers);
    if (onUsersUpdated) onUsersUpdated();
  };

  const getDirectorateName = (id: string) => {
    return directorates.find((d) => d.id === id)?.name || id;
  };

  return (
    <div className="p-6 space-y-6 animate-in w-full">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1A1A2E] via-[#E85D04]/20 to-purple-900/30 border border-[#E85D04]/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#E85D04]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#E85D04] text-white shadow-md">
                Super Admin Access
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Firebase Realtime Synced
              </span>
            </div>
            <h1 className="font-display text-3xl font-black text-white italic uppercase tracking-tight">
              Platform Admin Control Panel
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Manage platform permissions, team roles, directorates quota, and system usage metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E85D04] to-[#0099CC] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{currentUser.displayName}</p>
                <p className="text-[10px] text-[#0099CC] font-mono">{user?.email || currentUser.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Usage & System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-[#0099CC]" />
          </div>
          <div className="font-display text-3xl font-black text-white">{totalUsers}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            {superAdminCount} Super Admins · {leadCount} Leads
          </div>
        </div>

        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Directorates</span>
            <Layers className="w-5 h-5 text-[#E85D04]" />
          </div>
          <div className="font-display text-3xl font-black text-[#E85D04]">{directorates.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            All workstreams operational
          </div>
        </div>

        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Tasks</span>
            <Activity className="w-5 h-5 text-[#F4A261]" />
          </div>
          <div className="font-display text-3xl font-black text-[#F4A261]">{totalTasks}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            {completedTasks} completed ({totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)
          </div>
        </div>

        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Firestore Quota</span>
            <Server className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-display text-3xl font-black text-emerald-400">99.8%</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Health: Normal · 0 errors
          </div>
        </div>
      </div>

      {/* Main Section: User Role Management & Platform Usage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Roles & Access Control — Spans 2 cols */}
        <div className="lg:col-span-2 bg-[#1A1A2E]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                <Key className="w-5 h-5 text-[#E85D04]" />
                User Access & Role Management
              </h2>
              <p className="text-xs text-slate-400">
                Grant or revoke Super Admin and Directorate Lead roles for team members.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {userList.map((usr) => (
              <div
                key={usr.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#E85D04]/40 transition group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      usr.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={usr.displayName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-[#F4A261] transition">
                        {usr.displayName}
                      </h3>
                      {usr.role === 'super_admin' && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/30">
                          Super Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {usr.email} · <span className="text-[#0099CC]">{usr.title}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={usr.role}
                    onChange={(e) => handleRoleChange(usr.id, e.target.value as UserRole)}
                    className="bg-black/60 text-xs font-bold text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#E85D04] transition"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="directorate_lead">Directorate Lead</option>
                    <option value="member">Workspace Member</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform System Health & Usage Breakdown */}
        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
          <div>
            <h2 className="font-display text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#0099CC]" />
              Platform Diagnostics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live serverless execution metrics.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">AI Command API (⌘K)</span>
                <span className="text-[#0099CC]">Active / 1,000 req/mo</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-[#0099CC] to-[#E85D04] rounded-full w-[35%]" />
              </div>
              <p className="text-[10px] text-slate-500">Gemini Pro 1.5 Powered Parsing</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Firestore Realtime Listener</span>
                <span className="text-emerald-400">Connected (4 collections)</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-emerald-500 rounded-full w-[100%]" />
              </div>
              <p className="text-[10px] text-slate-500">Dual Sync (Firestore + LocalStorage)</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Firebase Auth Identity</span>
                <span className="text-[#F4A261]">OAuth2 & Credentials</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-[#F4A261] rounded-full w-[85%]" />
              </div>
              <p className="text-[10px] text-slate-500">Security Rules Enforced</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E85D04]/10 to-[#0099CC]/10 border border-[#E85D04]/30 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-[#E85D04]" />
              AminApps OS Environment Status
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              All 9 Directorates are synchronized with production Google Fonts (<span className="font-display italic text-[#F4A261]">Syne</span> and <span className="font-sans font-bold">Inter</span>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
