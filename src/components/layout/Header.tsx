'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Bell,
  ChevronDown,
  ShieldCheck,
  LogIn,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { Workspace, User as UserType } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenAICommand: () => void;
  onOpenCreateTask: () => void;
  onOpenWorkspaceModal: () => void;
  onOpenAuthModal: () => void;
  onOpenGuide: () => void;
  currentUser: UserType;
  currentWorkspace: Workspace;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAICommand,
  onOpenCreateTask,
  onOpenWorkspaceModal,
  onOpenAuthModal,
  onOpenGuide,
  currentUser,
  currentWorkspace,
}) => {
  const { user, userProfile, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 'n1', text: 'Fatima completed "Course Catalog & Syllabus"', time: '10m ago' },
    { id: 'n2', text: 'New announcement: Welcome to Alpha Spark OS', time: '1h ago' },
    { id: 'n3', text: 'Amina started work on "Webinar Flyer"', time: '2h ago' },
  ];

  const activeUser = userProfile || currentUser;
  const isSuperAdmin = activeUser.role === 'super_admin';

  return (
    <header className="h-16 border-b border-white/10 bg-[#1A1A2E]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left section: Workspace selector & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenWorkspaceModal}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#E85D04] via-[#F4A261] to-[#0099CC] flex items-center justify-center text-white font-black text-xs shadow-md glow-orange">
            AS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-[#F4A261] transition">
                {currentWorkspace.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-[10px] font-extrabold text-[#0099CC] tracking-widest uppercase">
              {currentWorkspace.planTier} Tier
            </span>
          </div>
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center relative w-64">
          <Search className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks, directorates..."
            className="w-full pl-9 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E85D04] transition"
          />
        </div>
      </div>

      {/* Right section: Onboarding Guide, AI Command, Create Task, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Onboarding Guide trigger */}
        <button
          onClick={onOpenGuide}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition border border-white/5"
          title="Onboarding Guide & Setup"
        >
          <HelpCircle className="w-4 h-4 text-[#0099CC]" />
        </button>

        {/* AI Command Bar Trigger */}
        <button
          onClick={onOpenAICommand}
          className="px-3.5 py-1.5 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg glow-orange border border-[#E85D04]/40 transition group"
        >
          <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition transform" />
          <span className="hidden sm:inline font-display uppercase tracking-wider italic text-xs">
            AI Manager
          </span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-black/40 text-[10px] rounded border border-white/20 text-amber-200 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Quick Create Task */}
        <button
          onClick={onOpenCreateTask}
          className="px-3 py-1.5 bg-[#0099CC] hover:bg-[#0099CC]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md glow-blue"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline uppercase tracking-wider text-xs">New Task</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E85D04] rounded-full ring-2 ring-[#1A1A2E] animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 animate-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] text-[#0099CC] font-bold">3 unread</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-xl bg-black/40 text-xs hover:bg-white/5 transition border border-white/5">
                    <p className="text-slate-200 font-medium">{n.text}</p>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Auth Pill */}
        <div className="relative border-l border-white/10 pl-3">
          {user ? (
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 hover:opacity-90 transition text-left"
            >
              <img
                src={activeUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={activeUser.displayName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E85D04]"
              />
              <div className="hidden xl:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white leading-none">{activeUser.displayName}</span>
                  {isSuperAdmin && (
                    <span className="px-1.5 py-0.5 text-[8px] font-black uppercase rounded bg-[#E85D04] text-white">
                      Super Admin
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#0099CC] mt-1 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Authenticated</span>
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#E85D04] text-white text-xs font-bold uppercase tracking-wider transition border border-white/20"
            >
              <LogIn className="w-3.5 h-3.5 text-[#F4A261]" />
              <span>Sign In</span>
            </button>
          )}

          {showProfileMenu && user && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl z-50 p-3 animate-in">
              <div className="p-2 border-b border-white/10 mb-2">
                <p className="text-xs font-bold text-white">{activeUser.displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                {isSuperAdmin && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase rounded bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/30">
                    Platform Super Admin
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
