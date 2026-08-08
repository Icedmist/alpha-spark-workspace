'use client';

import React, { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { TaskKanbanBoard } from '../../components/tasks/TaskKanbanBoard';
import { TaskListView } from '../../components/tasks/TaskListView';
import { WorkspaceStorageService } from '../../lib/storage';
import { LayoutGrid, List } from 'lucide-react';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  return (
    <AppShell>
      {({ tasks, directorates, users, selectedDirectorateId, openTaskDetail, openCreateTask, refreshData }) => {
        const filteredTasks = selectedDirectorateId
          ? tasks.filter((t) => t.directorateId === selectedDirectorateId)
          : tasks;

        return (
          <div className="flex-1 flex flex-col min-h-0">
            {/* View Mode Toggle Bar */}
            <div className="px-6 pt-4 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
                  Task Layout:
                </span>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      viewMode === 'kanban'
                        ? 'bg-[#E85D04] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Kanban</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      viewMode === 'list'
                        ? 'bg-[#E85D04] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table List</span>
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'kanban' ? (
              <TaskKanbanBoard
                tasks={filteredTasks}
                directorates={directorates}
                users={users}
                selectedDirectorateId={selectedDirectorateId}
                onTaskClick={openTaskDetail}
                onStatusChange={(taskId, newStatus) => {
                  WorkspaceStorageService.updateTaskStatus(taskId, newStatus);
                  refreshData();
                }}
                onCreateTaskClick={openCreateTask}
              />
            ) : (
              <TaskListView
                tasks={filteredTasks}
                directorates={directorates}
                users={users}
                onTaskClick={openTaskDetail}
                onStatusChange={(taskId, newStatus) => {
                  WorkspaceStorageService.updateTaskStatus(taskId, newStatus);
                  refreshData();
                }}
                onCreateTaskClick={openCreateTask}
              />
            )}
          </div>
        );
      }}
    </AppShell>
  );
}
