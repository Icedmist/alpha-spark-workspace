'use client';

import React, { useState } from 'react';
import { Directorate, Task, User as UserType } from '../../types';
import { ArrowUpRight, FolderKanban, PlusCircle } from 'lucide-react';
import { getDirectorateIcon } from '../../lib/directorateIcons';
import { CreateDirectorateModal } from './CreateDirectorateModal';

interface DirectorateGridProps {
  directorates: Directorate[];
  tasks: Task[];
  users: UserType[];
  currentUser?: UserType;
  onSelectDirectorate: (dirId: string) => void;
  onDirectorateCreated?: (dir: Directorate) => void;
}

export const DirectorateGrid: React.FC<DirectorateGridProps> = ({
  directorates,
  tasks,
  users,
  currentUser,
  onSelectDirectorate,
  onDirectorateCreated,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isSuperAdmin =
    currentUser?.role === 'super_admin' ||
    currentUser?.email?.toLowerCase() === 'talk2icedmist@gmail.com';

  return (
    <div className="p-6 space-y-6 animate-in w-full font-sans">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-[#1A1A2E] via-[#E85D04]/20 to-[#0099CC]/20 border border-[#E85D04]/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-[#E85D04]" /> Organizational Directorates
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
            Alpha Spark Workspace categorizes all company workflows into 9 specialized directorates. Click any directorate card below to filter tasks, review head leadership, and inspect task execution throughput.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-bold text-slate-300">
          <div className="bg-black/40 border border-white/10 px-4 py-2.5 rounded-2xl text-center">
            <span className="block text-[#0099CC] text-lg font-display font-black">{directorates.length}</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">Directorates</span>
          </div>
          <div className="bg-black/40 border border-white/10 px-4 py-2.5 rounded-2xl text-center">
            <span className="block text-[#E85D04] text-lg font-display font-black">{tasks.length}</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">Active Tasks</span>
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg glow-orange"
            >
              <PlusCircle className="w-4 h-4" /> New Directorate
            </button>
          )}
        </div>
      </div>

      {/* Grid of Directorates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {directorates.map((dir) => {
          const dirTasks = tasks.filter((t) => t.directorateId === dir.id);
          const completedTasks = dirTasks.filter((t) => t.status === 'completed');
          const completionRate = dirTasks.length > 0 ? Math.round((completedTasks.length / dirTasks.length) * 100) : 100;
          const leadUser = users.find((u) => u.id === dir.leadId);
          const IconComponent = getDirectorateIcon(dir.code || dir.icon);

          return (
            <div
              key={dir.id}
              onClick={() => onSelectDirectorate(dir.id)}
              className="group bg-[#1A1A2E]/80 hover:bg-[#1A1A2E] border border-white/10 hover:border-[#E85D04]/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between space-y-4 backdrop-blur-xl"
            >
              {/* Top Row: Icon Badge & Code */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#E85D04]/10 border border-[#E85D04]/30 flex items-center justify-center text-[#E85D04] group-hover:scale-110 group-hover:bg-[#E85D04]/20 transition shadow-inner">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-white/10 text-white border border-white/10">
                        {dir.code}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-[#F4A261] transition">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>

                {/* Directorate Name & Description */}
                <h3 className="font-display text-lg font-black text-white italic uppercase tracking-tight mt-4 group-hover:text-[#F4A261] transition">
                  {dir.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                  {dir.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Task Completion</span>
                  <span className="font-black text-[#0099CC]">{completionRate}%</span>
                </div>
                <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#0099CC] to-[#E85D04] rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Bottom Metadata: Lead & Task Counts */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                {/* Directorate Lead */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={leadUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={leadUser?.displayName}
                    className="w-8 h-8 rounded-full border border-white/10 object-cover ring-2 ring-[#E85D04]"
                  />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest">Directorate Lead</span>
                    <span className="font-bold text-white text-xs">{leadUser?.displayName.split(' ')[0] || 'Team Lead'}</span>
                  </div>
                </div>

                {/* Task counter badge */}
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest">Workload</span>
                  <span className="font-bold text-[#E85D04] text-xs">{dirTasks.length} Tasks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Directorate Modal */}
      <CreateDirectorateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        users={users}
        isSuperAdmin={isSuperAdmin}
        onDirectorateCreated={(dir) => {
          setShowCreateModal(false);
          if (onDirectorateCreated) onDirectorateCreated(dir);
        }}
      />
    </div>
  );
};
