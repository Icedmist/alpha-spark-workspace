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
  UserPlus,
  Lock,
  Terminal,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { User, Directorate, Task, UserRole, ActivityLog } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';
import { CreateUserModal } from './CreateUserModal';

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
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>(
    typeof window !== 'undefined' ? WorkspaceStorageService.getActivity() : []
  );

  // Security Gate: Verify if active email matches talk2icedmist@gmail.com or role is super_admin
  const isSuperAdminEmail =
    (user && user.email === 'talk2icedmist@gmail.com') ||
    currentUser.email === 'talk2icedmist@gmail.com' ||
    currentUser.role === 'super_admin';

  if (!isSuperAdminEmail) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-[#1A1A2E]/90 border border-red-500/30 rounded-3xl backdrop-blur-xl text-center space-y-4 shadow-2xl animate-in font-sans">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40 glow-red">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tight font-display">
          Super Admin Authorization Required
        </h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Access to Platform Administration, User Provisioning, and Security Audit Stream is restricted strictly to designated Super Admin credentials (<span className="text-[#0099CC] font-mono">talk2icedmist@gmail.com</span>).
        </p>
      </div>
    );
  }

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = userList.map((u) => {
      if (u.id === userId) {
        const newUser = { ...u, role: newRole };
        WorkspaceStorageService.saveUser(newUser);
        WorkspaceStorageService.logActivity(
          `changed role to ${newRole.replace('_', ' ')}`,
          'user',
          u.displayName
        );
        return newUser;
      }
      return u;
    });
    setUserList(updated);
    setAuditLogs(WorkspaceStorageService.getActivity());
    if (onUsersUpdated) onUsersUpdated();
  };

  const handleUserCreated = (newUser: User) => {
    setUserList((prev) => [...prev, newUser]);
    WorkspaceStorageService.logActivity(
      'provisioned new user account',
      'user',
      `${newUser.displayName} (${newUser.email})`
    );
    setAuditLogs(WorkspaceStorageService.getActivity());
    if (onUsersUpdated) onUsersUpdated();
  };

  const handleResetDatabase = () => {
    if (
      confirm(
        'Are you sure you want to clean and reset the workspace database to clean real production data?'
      )
    ) {
      WorkspaceStorageService.clearAndResetDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in font-sans">
      {/* Super Admin Control Header */}
      <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E85D04]/10 via-[#0099CC]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/40 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Control Console
              </span>
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                System Online
              </span>
            </div>

            <h1 className="font-display text-3xl font-black text-white italic uppercase tracking-tight">
              Platform Administration & System Security
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Manage workspace access, provision new team member accounts, adjust directorate assignments, monitor live security audit streams, and reset local system storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg glow-orange"
            >
              <UserPlus className="w-4 h-4" /> Provision New User
            </button>
            <button
              onClick={handleResetDatabase}
              className="px-4 py-2.5 bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
              title="Clean & Reset Database"
            >
              <RotateCcw className="w-4 h-4 text-[#0099CC]" /> Clean DB
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Team Users</span>
            <span className="text-2xl font-black text-white font-display mt-1 block">{userList.length}</span>
            <span className="text-[10px] text-[#0099CC] font-bold mt-1 block">Active Workspace Members</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E85D04]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Directorates</span>
            <span className="text-2xl font-black text-white font-display mt-1 block">{directorates.length}</span>
            <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Operational Workstreams</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#0099CC]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Managed Tasks</span>
            <span className="text-2xl font-black text-white font-display mt-1 block">{tasks.length}</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1 block">Across all Directorates</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F4A261]">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Super Admin Identity</span>
            <span className="text-xs font-black text-[#0099CC] font-mono mt-1 block truncate max-w-[140px]">
              {user?.email || currentUser.email}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Verified Credentials</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
            <Key className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Section: User Role Management & Security Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Roles & Access Control */}
        <div className="lg:col-span-2 bg-[#1A1A2E]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                <Key className="w-5 h-5 text-[#E85D04]" />
                User Access & Provisioned Accounts
              </h2>
              <p className="text-xs text-slate-400">
                Grant or revoke Super Admin and Directorate Lead roles for team members.
              </p>
            </div>

            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#E85D04]/20 border border-[#E85D04]/40 hover:bg-[#E85D04]/30 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#E85D04]" />
              <span>New User</span>
            </button>
          </div>

          <div className="space-y-3">
            {userList.map((usr) => (
              <div
                key={usr.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#E85D04]/40 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      usr.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={usr.displayName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-[#F4A261] transition truncate">
                        {usr.displayName}
                      </h3>
                      {usr.role === 'super_admin' && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/30 shrink-0">
                          Super Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {usr.email} · <span className="text-[#0099CC]">{usr.title}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
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

        {/* Security Audit Log Stream */}
        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
          <div>
            <h2 className="font-display text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#E85D04]" />
              Security Audit Stream
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time security and admin event logging.
            </p>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No security events logged yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#0099CC]" />
                      {log.actorName}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <span className="text-[#E85D04] font-bold">{log.action}</span> on <span className="font-mono text-white text-[11px]">{log.targetTitle}</span>
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E85D04]/10 to-[#0099CC]/10 border border-[#E85D04]/30 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-[#E85D04]" />
              Audit Security Engine
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              All user creations, role alterations, and task deletions are immutably logged for platform accountability.
            </p>
          </div>
        </div>
      </div>

      {/* Super Admin User Creation Modal */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        directorates={directorates}
        onUserCreated={handleUserCreated}
        currentUser={currentUser}
      />
    </div>
  );
};
