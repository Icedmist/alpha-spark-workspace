'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Kanban,
  Building2,
  Calendar,
  FileText,
  Megaphone,
  BarChart3,
  ChevronRight,
  ShieldCheck,
  X,
  Terminal,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { Directorate, Task, User } from '../../types';
import { getDirectorateIcon } from '../../lib/directorateIcons';

interface SidebarProps {
  directorates: Directorate[];
  tasks: Task[];
  selectedDirectorateId?: string;
  onSelectDirectorate?: (id: string | undefined) => void;
  currentUser?: User;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  directorates,
  tasks,
  selectedDirectorateId,
  onSelectDirectorate,
  currentUser,
  isOpenMobile = false,
  onCloseMobile,
  onOpenGuide,
}) => {
  const pathname = usePathname();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Task Board', href: '/tasks', icon: Kanban },
    { name: 'Directorates', href: '/directorates', icon: Building2 },
    { name: 'Calendar & Schedules', href: '/calendar', icon: Calendar },
    { name: 'Meeting Notes', href: '/meetings', icon: FileText },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
    { name: 'Analytics & Reports', href: '/analytics', icon: BarChart3 },
    ...(isSuperAdmin
      ? [{ name: 'Platform Admin', href: '/admin', icon: ShieldCheck, isSpecial: true }]
      : []),
  ];

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const handleDirectorateClick = (dirId?: string) => {
    if (onSelectDirectorate) onSelectDirectorate(dirId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in"
        />
      )}

      <aside
        className={`w-64 bg-[#1A1A2E]/95 border-r border-white/10 flex flex-col h-screen fixed md:sticky top-0 z-50 select-none backdrop-blur-xl transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand logo & Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/assets/logo.png"
              alt="Alpha Spark Logo"
              className="w-8 h-8 object-contain rounded-lg group-hover:scale-105 transition transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
            <div>
              <h1 className="font-display text-base font-extrabold text-white tracking-tight leading-none italic uppercase group-hover:text-[#F4A261] transition">
                ALPHA SPARK
              </h1>
              <span className="text-[9px] font-bold text-[#0099CC] tracking-widest uppercase mt-0.5 block font-sans">
                AminApps OS
              </span>
            </div>
          </Link>

          {/* Close button for Mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">
              Workspace Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleNavClick}
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
                      <span className="font-sans">{item.name}</span>
                    </div>
                    {isActive && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${
                          item.isSpecial ? 'text-purple-300' : 'text-[#E85D04]'
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Directorate Filters with Icons */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">
                Directorates ({directorates.length})
              </span>
              {selectedDirectorateId && (
                <button
                  onClick={() => handleDirectorateClick(undefined)}
                  className="text-[10px] text-[#0099CC] hover:underline font-bold font-sans"
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
                const DirIcon = getDirectorateIcon(dir.code || dir.icon);

                return (
                  <button
                    key={dir.id}
                    onClick={() => handleDirectorateClick(isSelected ? undefined : dir.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                      isSelected
                        ? 'bg-[#0099CC]/20 text-white border border-[#0099CC]/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <DirIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-[#0099CC]' : 'text-[#E85D04]'}`} />
                      <span className="truncate font-sans">{dir.name}</span>
                    </div>
                    {activeCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#0099CC]/20 text-[#0099CC] rounded-md border border-[#0099CC]/30 font-sans">
                        {activeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Shortcut Info & Onboarding Launcher */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="w-full p-2.5 bg-[#0099CC]/15 hover:bg-[#0099CC]/25 border border-[#0099CC]/40 rounded-2xl text-xs font-bold text-white flex items-center justify-between transition group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0099CC]" />
                <span className="font-sans text-xs">Help & Onboarding</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#0099CC] group-hover:translate-x-0.5 transition" />
            </button>
          )}

          <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#E85D04]" />
              <span className="font-sans text-xs text-white">Command Palette</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight font-sans">
              Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-white font-mono text-[10px]">⌘K</kbd> anytime to open quick search.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
