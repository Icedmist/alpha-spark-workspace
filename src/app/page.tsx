'use client';

import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { TaskKanbanBoard } from '../components/tasks/TaskKanbanBoard';
import { WorkspaceStorageService } from '../lib/storage';

export default function HomePage() {
  return (
    <AppShell>
      {({ tasks, directorates, users, selectedDirectorateId, openTaskDetail, openCreateTask, refreshData }) => {
        const filteredTasks = selectedDirectorateId
          ? tasks.filter((t) => t.directorateId === selectedDirectorateId)
          : tasks;

        return (
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
        );
      }}
    </AppShell>
  );
}
