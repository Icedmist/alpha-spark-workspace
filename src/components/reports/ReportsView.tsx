'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  CalendarDays,
  Building2,
  Target,
  Zap,
} from 'lucide-react';
import { Task, Directorate, User, WeeklyReport, ActivityLog } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';
import { Leaderboard } from './Leaderboard';

interface ReportsViewProps {
  tasks: Task[];
  directorates: Directorate[];
  users: User[];
  currentUser: User;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  tasks,
  directorates,
  users,
  currentUser,
}) => {
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    setActivityLog(WorkspaceStorageService.getActivity());
  }, []);

  // Derived stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter((t) => t.status === 'review').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()
  ).length;
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const dirBreakdown = directorates.map((d) => {
    const dirTasks = tasks.filter((t) => t.directorateId === d.id);
    const completed = dirTasks.filter((t) => t.status === 'completed').length;
    return { directorate: d, total: dirTasks.length, completed };
  });

  const priorityBreakdown = [
    { label: 'Urgent', count: urgentTasks, color: '#ef4444' },
    { label: 'High', count: tasks.filter((t) => t.priority === 'high').length, color: '#f97316' },
    { label: 'Medium', count: tasks.filter((t) => t.priority === 'medium').length, color: '#eab308' },
    { label: 'Low', count: tasks.filter((t) => t.priority === 'low').length, color: '#22c55e' },
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1800));

    const period =
      selectedPeriod === 'weekly'
        ? `Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : `Month of ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

    const highlights: string[] = [];

    // Top performing directorate
    const topDir = dirBreakdown.sort((a, b) => b.completed - a.completed)[0];
    if (topDir && topDir.completed > 0) {
      highlights.push(
        `${topDir.directorate.name} led with ${topDir.completed} tasks completed this ${selectedPeriod}.`
      );
    }
    if (overdueTasks > 0) {
      highlights.push(
        `${overdueTasks} task${overdueTasks > 1 ? 's are' : ' is'} overdue — immediate attention required.`
      );
    }
    if (completionRate >= 70) {
      highlights.push(`Strong team performance: ${completionRate}% overall completion rate achieved.`);
    }
    if (urgentTasks > 0) {
      highlights.push(`${urgentTasks} urgent task${urgentTasks > 1 ? 's' : ''} still pending.`);
    }

    const newReport: WeeklyReport = {
      id: `rpt-${Date.now()}`,
      workspaceId: WorkspaceStorageService.getCurrentWorkspaceId(),
      title: `${selectedPeriod === 'weekly' ? 'Weekly' : 'Monthly'} Performance Report`,
      period,
      completedTaskCount: completedTasks,
      inProgressTaskCount: inProgressTasks,
      overdueTaskCount: overdueTasks,
      directorateBreakdown: dirBreakdown.map((d) => ({
        directorateName: d.directorate.name,
        completed: d.completed,
        total: d.total,
      })),
      summaryText: `Alpha Spark recorded ${completedTasks} completed tasks out of ${totalTasks} total (${completionRate}% completion rate) for ${period}. There are currently ${inProgressTasks} tasks in progress and ${overdueTasks} overdue items requiring attention.`,
      highlights,
      createdAt: new Date().toISOString(),
    };

    setReport(newReport);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Analytics &amp; Reports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Performance overview, directorate breakdown, and AI-generated summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-slate-700">
            {(['weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3.5 py-1.5 text-xs font-medium capitalize transition ${
                  selectedPeriod === p
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/20"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            )}
            {isGenerating ? 'Generating…' : 'Generate AI Report'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Tasks',
            value: totalTasks,
            icon: Target,
            color: 'text-slate-300',
            bg: 'from-slate-800/80 to-slate-900/80',
            border: 'border-slate-700/60',
            trend: null,
          },
          {
            label: 'Completed',
            value: completedTasks,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'from-emerald-950/40 to-slate-900/80',
            border: 'border-emerald-700/30',
            trend: `${completionRate}% rate`,
          },
          {
            label: 'In Progress',
            value: inProgressTasks,
            icon: Zap,
            color: 'text-indigo-400',
            bg: 'from-indigo-950/40 to-slate-900/80',
            border: 'border-indigo-700/30',
            trend: `+${reviewTasks} in review`,
          },
          {
            label: 'Overdue',
            value: overdueTasks,
            icon: AlertCircle,
            color: 'text-red-400',
            bg: 'from-red-950/40 to-slate-900/80',
            border: 'border-red-700/30',
            trend: overdueTasks > 0 ? 'Needs action' : 'All clear!',
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`bg-gradient-to-br ${kpi.bg} border ${kpi.border} rounded-2xl p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${kpi.color}`} />
                {kpi.trend && (
                  <span className="text-[10px] text-slate-400 font-medium">{kpi.trend}</span>
                )}
              </div>
              <div className={`text-3xl font-bold ${kpi.color} mb-0.5`}>{kpi.value}</div>
              <div className="text-xs text-slate-500">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      {/* Task Status Breakdown + Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status distribution bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Status Distribution
          </h3>
          {[
            { label: 'Completed', count: completedTasks, color: '#22c55e' },
            { label: 'In Progress', count: inProgressTasks, color: '#6366f1' },
            { label: 'In Review', count: reviewTasks, color: '#f59e0b' },
            { label: 'To Do', count: todoTasks, color: '#475569' },
          ].map((s) => (
            <div key={s.label} className="mb-3">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>{s.label}</span>
                <span className="font-semibold">{s.count}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: totalTasks > 0 ? `${(s.count / totalTasks) * 100}%` : '0%',
                    backgroundColor: s.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Priority breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Priority Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {priorityBreakdown.map((p) => (
              <div
                key={p.label}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-950/40"
              >
                <span
                  className="text-2xl font-bold mb-0.5"
                  style={{ color: p.color }}
                >
                  {p.count}
                </span>
                <span className="text-[11px] text-slate-500">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Directorate breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          Directorate Performance
        </h3>
        <div className="space-y-3">
          {dirBreakdown
            .filter((d) => d.total > 0)
            .sort((a, b) => b.total - a.total)
            .map(({ directorate, completed, total }) => {
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <div key={directorate.id} className="flex items-center gap-4">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: directorate.color }}
                  />
                  <span className="text-xs text-slate-300 w-44 truncate">
                    {directorate.name}
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: directorate.color,
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 w-24 text-right">
                    {completed}/{total} ({pct}%)
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Task Completion Leaderboard */}
      <Leaderboard tasks={tasks} users={users} />

      {/* Generated report */}
      {report && (
        <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 animate-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">{report.title}</h3>
                <span className="text-[11px] text-slate-400">{report.period}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                AI Generated
              </span>
              <button className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-5">{report.summaryText}</p>

          {report.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Key Highlights
              </h4>
              <ul className="space-y-2">
                {report.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-indigo-500/20">
            {[
              { label: 'Completed', value: report.completedTaskCount, icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'In Progress', value: report.inProgressTaskCount, icon: Clock, color: 'text-indigo-400' },
              { label: 'Overdue', value: report.overdueTaskCount, icon: AlertCircle, color: 'text-red-400' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <Icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-slate-500">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Recent Activity
        </h3>
        {activityLog.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No activity yet.</p>
        ) : (
          <div className="space-y-2">
            {activityLog.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/50 transition"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-slate-200">{log.actorName}</span>{' '}
                    {log.action}{' '}
                    <span className="text-indigo-300 font-medium">"{log.targetTitle}"</span>
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
