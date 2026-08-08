'use client';

import React from 'react';
import { Directorate, Task, User as UserType } from '../../types';
import { Users, CheckCircle2, Clock, AlertCircle, ArrowUpRight, FolderKanban } from 'lucide-react';

interface DirectorateGridProps {
  directorates: Directorate[];
  tasks: Task[];
  users: UserType[];
  onSelectDirectorate: (dirId: string) => void;
}

export const DirectorateGrid: React.FC<DirectorateGridProps> = ({
  directorates,
  tasks,
  users,
  onSelectDirectorate,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-400" /> Organizational Directorate Infrastructure
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Alpha Spark Workspace categorizes all company workflows into 9 specialized directorates. Click any directorate card below to filter tasks, review head leadership, and inspect task execution throughput.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-center">
            <span className="block text-indigo-400 text-base font-bold">{directorates.length}</span>
            <span className="text-[10px] text-slate-400 uppercase">Directorates</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-center">
            <span className="block text-emerald-400 text-base font-bold">{tasks.length}</span>
            <span className="text-[10px] text-slate-400 uppercase">Active Tasks</span>
          </div>
        </div>
      </div>

      {/* Grid of Directorates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {directorates.map((dir) => {
          const dirTasks = tasks.filter((t) => t.directorateId === dir.id);
          const completedTasks = dirTasks.filter((t) => t.status === 'completed');
          const completionRate = dirTasks.length > 0 ? Math.round((completedTasks.length / dirTasks.length) * 100) : 100;
          const leadUser = users.find((u) => u.id === dir.leadUserId);
          const dirMembers = users.filter((u) => u.directorateId === dir.id);

          return (
            <div
              key={dir.id}
              onClick={() => onSelectDirectorate(dir.id)}
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              {/* Top Row: Color Badge & Code */}
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-lg text-white shadow"
                    style={{ backgroundColor: dir.color }}
                  >
                    {dir.code}
                  </span>
                  <span className="text-slate-500 group-hover:text-indigo-400 transition">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>

                {/* Directorate Name & Description */}
                <h3 className="text-lg font-bold text-slate-100 mt-3 group-hover:text-indigo-300 transition">
                  {dir.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {dir.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Task Completion Rate</span>
                  <span className="font-bold text-slate-200">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Bottom Metadata: Lead & Task Counts */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                {/* Directorate Lead */}
                <div className="flex items-center gap-2">
                  <img
                    src={leadUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={leadUser?.displayName}
                    className="w-7 h-7 rounded-full border border-slate-700 object-cover"
                  />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Directorate Lead</span>
                    <span className="font-semibold text-slate-200">{leadUser?.displayName.split(' ')[0] || 'Team Lead'}</span>
                  </div>
                </div>

                {/* Task counter badge */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase">Workload</span>
                  <span className="font-bold text-indigo-400">{dirTasks.length} Tasks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
