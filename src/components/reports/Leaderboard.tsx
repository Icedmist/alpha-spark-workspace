'use client';

import React, { useMemo } from 'react';
import { Trophy, Crown, CheckCircle2 } from 'lucide-react';
import { Task, User } from '../../types';

interface LeaderboardProps {
  tasks: Task[];
  users: User[];
}

interface LeaderboardRow {
  user: User;
  completedCount: number;
  inProgressCount: number;
}

const MEDAL_STYLES = [
  {
    ring: 'ring-yellow-400',
    badge: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white',
    label: '1st Place',
  },
  {
    ring: 'ring-slate-300',
    badge: 'bg-gradient-to-br from-slate-300 to-slate-500 text-black',
    label: '2nd Place',
  },
  {
    ring: 'ring-amber-700',
    badge: 'bg-gradient-to-br from-amber-700 to-amber-900 text-white',
    label: '3rd Place',
  },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ tasks, users }) => {
  const rows = useMemo<LeaderboardRow[]>(() => {
    return users
      .map((user) => {
        const userTasks = tasks.filter((t) => t.assigneeIds?.includes(user.id) || t.createdBy === user.id);
        return {
          user,
          completedCount: userTasks.filter((t) => t.status === 'completed').length,
          inProgressCount: userTasks.filter((t) => t.status === 'in_progress' || t.status === 'review').length,
        };
      })
      .sort((a, b) => b.completedCount - a.completedCount);
  }, [tasks, users]);

  const top3 = rows.slice(0, 3);
  const maxCompleted = rows[0]?.completedCount || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Task Completion Leaderboard
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Top 3 highlighted</span>
      </div>

      {/* Podium: Top 3 */}
      <div className="flex items-end justify-center gap-3 mb-5">
        {top3.map((row, idx) => {
          const style = MEDAL_STYLES[idx];
          const height = idx === 0 ? 'h-28' : idx === 1 ? 'h-20' : 'h-16';
          return (
            <div key={row.user.id} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative">
                <img
                  src={row.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={row.user.displayName}
                  className={`w-16 h-16 rounded-full object-cover ring-4 ${style.ring} shadow-xl`}
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full ${style.badge} flex items-center justify-center font-black text-[10px] border-2 border-slate-900`}
                >
                  {idx + 1}
                </span>
              </div>
              <div className="text-center min-w-0">
                <p className="text-xs font-bold text-white truncate max-w-[7rem]">
                  {row.user.displayName.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{row.user.title}</p>
              </div>
              <div
                className={`w-full ${height} rounded-t-xl bg-gradient-to-t ${
                  idx === 0
                    ? 'from-amber-500/40 to-amber-400/80 border-amber-400/60'
                    : idx === 1
                    ? 'from-slate-600/40 to-slate-400/60 border-slate-400/50'
                    : 'from-amber-900/40 to-amber-700/50 border-amber-700/60'
                } border flex items-end justify-center pb-1.5`}
              >
                <div className="text-center">
                  <span className="text-lg font-black text-white block leading-none">
                    {row.completedCount}
                  </span>
                  <span className="text-[8px] text-slate-300 uppercase tracking-widest font-bold">
                    done
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Podium Highlight / Summary */}
      {top3.length > 0 && (
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 mb-4 flex items-center gap-3">
          <Crown className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-[11px] text-slate-300 leading-relaxed">
            <span className="font-black text-amber-300">{top3[0].user.displayName.split(' ')[0]}</span> currently
            leads the board with{' '}
            <span className="font-black text-white">{top3[0].completedCount} completed tasks</span> —{' '}
            {top3[0].completedCount > 0
              ? `that's ${maxCompleted > 0 ? Math.round((top3[0].completedCount / maxCompleted) * 100) : 0}% of the team's completion effort.`
              : 'start driving tasks to completion to claim the crown!'}
          </p>
        </div>
      )}

      {/* Full standings list */}
      <div className="space-y-1.5">
        {rows.map((row, idx) => {
          const isPodium = idx < 3;
          const pct = maxCompleted > 0 ? Math.round((row.completedCount / maxCompleted) * 100) : 0;
          return (
            <div
              key={row.user.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition ${
                isPodium
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-black/30 border-white/5 hover:border-white/20'
              }`}
            >
              <span
                className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isPodium
                    ? MEDAL_STYLES[idx].badge
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {idx + 1}
              </span>
              <img
                src={row.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={row.user.displayName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">{row.user.displayName}</p>
                  <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {row.completedCount} done
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isPodium
                          ? idx === 0
                            ? '#fbbf24'
                            : idx === 1
                            ? '#cbd5e1'
                            : '#b45309'
                          : '#0099CC',
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono flex-shrink-0">
                    {row.inProgressCount} active
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-6 flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4" />
          No team members ranked yet.
        </p>
      )}
    </div>
  );
};