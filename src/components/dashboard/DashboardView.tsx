'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Task, Directorate, User, Workspace, ActivityLog } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';

interface DashboardViewProps {
  tasks: Task[];
  directorates: Directorate[];
  users: User[];
  currentUser: User;
  currentWorkspace: Workspace;
  onOpenAICommand: () => void;
  onOpenCreateTask: () => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  directorates,
  currentUser,
  currentWorkspace,
  onOpenAICommand,
  onOpenCreateTask,
  onNavigate,
}) => {
  const [activity, setActivity] = useState<ActivityLog[]>([]);

  useEffect(() => {
    setActivity(WorkspaceStorageService.getActivity().slice(0, 8));
  }, [tasks]);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()
  ).length;
  const urgent = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const getDir = (id: string) => directorates.find((d) => d.id === id);

  const statusConfig = {
    todo: { label: 'To Do', cls: 'bg-slate-700/60 text-slate-300' },
    in_progress: { label: 'In Progress', cls: 'bg-[#0099CC]/20 text-[#0099CC] border border-[#0099CC]/30' },
    review: { label: 'In Review', cls: 'bg-[#F4A261]/20 text-[#F4A261] border border-[#F4A261]/30' },
    completed: { label: 'Done', cls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  };

  const priorityDot = {
    urgent: 'bg-red-500 shadow-sm shadow-red-500',
    high: 'bg-[#E85D04] shadow-sm shadow-[#E85D04]',
    medium: 'bg-[#F4A261]',
    low: 'bg-emerald-400',
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col gap-6 p-6 w-full animate-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1A1A2E] via-[#E85D04]/20 to-[#0099CC]/20 border border-[#E85D04]/30 rounded-3xl p-8 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#E85D04]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#0099CC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-extrabold text-[#0099CC] uppercase tracking-widest mb-1">
            {greeting} 👋
          </p>
          <h2 className="font-display text-3xl font-black text-white italic uppercase tracking-tight mb-1">
            {currentUser.displayName}
          </h2>
          <p className="text-xs text-slate-300 mb-6 font-medium">
            {currentWorkspace.name} · {currentUser.title}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenAICommand}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg glow-orange border border-[#E85D04]/40"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              AI Command Bar
              <kbd className="px-1.5 py-0.5 text-[10px] bg-black/40 rounded border border-white/20 text-amber-200 font-mono">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={onOpenCreateTask}
              className="flex items-center gap-2 px-5 py-3 bg-[#0099CC] hover:bg-[#0099CC]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md glow-blue"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Completed Tasks',
            value: completed,
            sub: `${completionRate}% overall rate`,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'from-emerald-950/40 via-[#1A1A2E] to-slate-900',
            border: 'border-emerald-500/30',
          },
          {
            label: 'In Progress',
            value: inProgress,
            sub: `Active workstreams`,
            icon: Zap,
            color: 'text-[#0099CC]',
            bg: 'from-[#0099CC]/20 via-[#1A1A2E] to-slate-900',
            border: 'border-[#0099CC]/30',
          },
          {
            label: 'Overdue Tasks',
            value: overdue,
            sub: overdue > 0 ? 'Action needed' : 'On schedule',
            icon: AlertCircle,
            color: overdue > 0 ? 'text-red-400' : 'text-slate-400',
            bg: 'from-red-950/40 via-[#1A1A2E] to-slate-900',
            border: overdue > 0 ? 'border-red-500/30' : 'border-white/10',
          },
          {
            label: 'Urgent Priority',
            value: urgent,
            sub: 'High importance',
            icon: Clock,
            color: urgent > 0 ? 'text-[#E85D04]' : 'text-slate-400',
            bg: 'from-[#E85D04]/20 via-[#1A1A2E] to-slate-900',
            border: urgent > 0 ? 'border-[#E85D04]/40' : 'border-white/10',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-5 flex flex-col gap-3 backdrop-blur-md shadow-lg transition hover:border-[#E85D04]/50`}
            >
              <Icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <div className={`font-display text-4xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mt-1">{stat.label}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">{stat.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower section: Recent tasks + Directorate pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#E85D04]" />
              Recent Tasks
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-bold text-[#0099CC] hover:underline flex items-center gap-1 transition uppercase tracking-wider"
            >
              View matrix <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {recentTasks.map((task) => {
              const dir = getDir(task.directorateId);
              const sc = statusConfig[task.status];
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-black/30 border border-white/5 hover:border-[#E85D04]/40 transition cursor-pointer group"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-[#F4A261] transition">
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {dir?.name} · Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex-shrink-0 ${sc.cls}`}
                  >
                    {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Directorate pulse */}
        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0099CC]" />
              Directorates
            </h3>
            <button
              onClick={() => onNavigate('directorates')}
              className="text-xs font-bold text-[#0099CC] hover:underline flex items-center gap-1 transition uppercase tracking-wider"
            >
              View grid <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3.5">
            {directorates.slice(0, 8).map((dir) => {
              const dirTasks = tasks.filter((t) => t.directorateId === dir.id);
              const done = dirTasks.filter((t) => t.status === 'completed').length;
              const pct = dirTasks.length > 0 ? Math.round((done / dirTasks.length) * 100) : 0;
              return (
                <div key={dir.id}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-200 flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: dir.color }}
                      />
                      {dir.name}
                    </span>
                    <span className="text-slate-400 flex-shrink-0 ml-1">
                      {done}/{dirTasks.length}
                    </span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${pct}%`, backgroundColor: dir.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      {activity.length > 0 && (
        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="font-display text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-slate-400" />
            Workspace Activity Log
          </h3>
          <div className="space-y-2">
            {activity.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-white/5 hover:border-white/20 transition"
              >
                <div className="w-2 h-2 rounded-full bg-[#E85D04] mt-1.5 flex-shrink-0 glow-orange" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-white">{log.actorName}</span>{' '}
                  {log.action}{' '}
                  <span className="text-[#0099CC] font-semibold">"{log.targetTitle}"</span>
                </p>
                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 ml-auto">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
