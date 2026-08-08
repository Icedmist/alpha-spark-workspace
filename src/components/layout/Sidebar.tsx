'use client';

import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  Building2,
  Calendar,
  FileText,
  Megaphone,
  BarChart3,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Directorate, Task, User } from '../../types';

interface SidebarProps {
  directorates: Directorate[];
  tasks: Task[];
  selectedDirectorateId?: string;
  onSelectDirectorate?: (id: string | undefined) => void;
  currentView?: string;
  onNavigate?: (view: string) => void;
  currentUser?: User;
}

export const Sidebar: React.FC<SidebarProps> = ({
  directorates,
  tasks,
  selectedDirectorateId,
  onSelectDirectorate,
  currentView = 'dashboard',
  onNavigate,
  currentUser,
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const navItems = [
    { name: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
    { name: 'Task Board', view: 'tasks', icon: Kanban },
    { name: 'Directorates', view: 'directorates', icon: Building2 },
    { name: 'Calendar & Schedules', view: 'calendar', icon: Calendar },
    { name: 'Meeting Notes', view: 'meetings', icon: FileText },
    { name: 'Announcements', view: 'announcements', icon: Megaphone },
    { name: 'Analytics & Reports', view: 'analytics', icon: BarChart3 },
    ...(isSuperAdmin
      ? [{ name: 'Platform Admin', view: 'admin', icon: ShieldCheck, isSpecial: true }]
      : []),
  ];

  return (
    <aside className="w-64 bg-[#1A1A2E]/95 border-r border-white/10 flex flex-col h-screen sticky top-0 z-40 select-none backdrop-blur-xl">
      {/* Brand logo */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E85D04] via-[#F4A261] to-[#0099CC] flex items-center justify-center shadow-lg glow-orange">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-base font-extrabold text-white tracking-tight leading-none italic uppercase">
            ALPHA SPARK
          </h1>
          <span className="text-[9px] font-bold text-[#0099CC] tracking-widest uppercase mt-0.5 block">
            AminApps OS
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Workspace Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate && onNavigate(item.view)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${
                    isActive
                      ? item.isSpecial
                        ? 'bg-purple-600/30 text-white border border-purple-500/50 shadow-md'
                        : 'bg-[#E85D04]/20 text-white border border-[#E85D04]/50 shadow-md'
                      : item.isSpecial
                      ? 'text-purple-300 hover:text-white hover:bg-purple-500/10 border border-purple-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? item.isSpecial
                            ? 'text-purple-300'
                            : 'text-[#E85D04]'
                          : item.isSpecial
                          ? 'text-purple-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${
                        item.isSpecial ? 'text-purple-300' : 'text-[#E85D04]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Directorate Filters */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Directorates ({directorates.length})
            </span>
            {selectedDirectorateId && (
              <button
                onClick={() => onSelectDirectorate && onSelectDirectorate(undefined)}
                className="text-[10px] text-[#0099CC] hover:underline font-bold"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="space-y-1">
            {directorates.map((dir) => {
              const activeCount = tasks.filter(
                (t) => t.directorateId === dir.id && t.status !== 'completed'
              ).length;
              const isSelected = selectedDirectorateId === dir.id;

              return (
                <button
                  key={dir.id}
                  onClick={() => onSelectDirectorate && onSelectDirectorate(isSelected ? undefined : dir.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                    isSelected
                      ? 'bg-[#0099CC]/20 text-white border border-[#0099CC]/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: dir.color }}
                    ></span>
                    <span className="truncate">{dir.name}</span>
                  </div>
                  {activeCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#0099CC]/20 text-[#0099CC] rounded-md border border-[#0099CC]/30">
                      {activeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="p-3 bg-gradient-to-br from-slate-900 via-[#1A1A2E] to-[#E85D04]/20 border border-[#E85D04]/30 rounded-2xl text-xs">
          <div className="flex items-center gap-1.5 text-[#E85D04] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-display uppercase italic text-xs">AI Manager Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-white font-mono text-[10px]">⌘K</kbd> to launch natural language AI commands.
          </p>
        </div>
      </div>
    </aside>
  );
};
