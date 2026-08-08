'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  LogOut,
  HelpCircle,
  Menu,
  Terminal,
} from 'lucide-react';
import { Workspace, User as UserType } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenAICommand: () => void;
  onOpenCreateTask: () => void;
  onOpenWorkspaceModal: () => void;
  onOpenAuthModal: () => void;
  onOpenGuide: () => void;
  onToggleMobileSidebar?: () => void;
  currentUser: UserType;
  currentWorkspace: Workspace;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAICommand,
  onOpenCreateTask,
  onOpenWorkspaceModal,
  onOpenAuthModal,
  onOpenGuide,
  onToggleMobileSidebar,
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

  return (
    <header className="h-16 border-b border-white/10 bg-[#1A1A2E]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      {/* Left section: Mobile menu toggle, Workspace selector & Search */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition border border-white/5"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Workspace selector with Real Logo */}
        <button
          onClick={onOpenWorkspaceModal}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left group"
        >
          <img
            src="/assets/logo.png"
            alt="Alpha Spark Logo"
            className="w-7 h-7 object-contain rounded-lg shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-[#F4A261] transition">
                {currentWorkspace.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-[10px] font-extrabold text-[#0099CC] tracking-widest uppercase block">
              {currentWorkspace.planTier} Tier
            </span>
          </div>
        </button>

        {/* Search bar */}
        <div className="hidden lg:flex items-center relative w-64">
          <Search className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks, directorates..."
            className="w-full pl-9 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E85D04] transition font-sans"
          />
        </div>
      </div>

      {/* Right section: Onboarding Guide, Command Search, Create Task, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Onboarding Guide trigger */}
        <button
          onClick={onOpenGuide}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition border border-white/5"
          title="Onboarding Guide & Setup"
        >
          <HelpCircle className="w-4 h-4 text-[#0099CC]" />
        </button>

        {/* Command Search Trigger (Clean, natural workspace command palette) */}
        <button
          onClick={onOpenAICommand}
          className="px-3 py-1.5 bg-black/40 hover:bg-white/10 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-white/10 transition group"
        >
          <Terminal className="w-4 h-4 text-[#E85D04]" />
          <span className="hidden sm:inline font-sans text-xs">
            Commands
          </span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-white/10 text-[10px] rounded border border-white/20 text-slate-300 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Quick Create Task */}
        <button
          onClick={onOpenCreateTask}
          className="px-3 py-1.5 bg-[#E85D04] hover:bg-[#E85D04]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md glow-orange"
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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E85D04] rounded-full ring-2 ring-[#1A1A2E]"></span>
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

        {/* Profile / Auth Menu */}
        <div className="relative border-l border-white/10 pl-2 sm:pl-3">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition"
          >
            <img
              src={
                activeUser.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              }
              alt={activeUser.displayName}
              className="w-8 h-8 rounded-full border border-white/10 object-cover ring-2 ring-[#E85D04]"
            />
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">
                {activeUser.displayName}
              </span>
              <span className="text-[9px] text-[#0099CC] font-bold uppercase tracking-wider block">
                {activeUser.role.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl z-50 p-2 animate-in space-y-1">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-xs font-bold text-white">{activeUser.displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{activeUser.email}</p>
              </div>

              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition"
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
