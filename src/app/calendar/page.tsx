'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { CalendarView } from '../../components/calendar/CalendarView';

export default function CalendarPage() {
  return (
    <AppShell>
      {({ tasks, directorates, selectedDirectorateId, openTaskDetail, openCreateTask }) => {
        const filteredTasks = selectedDirectorateId
          ? tasks.filter((t) => t.directorateId === selectedDirectorateId)
          : tasks;

        return (
          <CalendarView
            tasks={filteredTasks}
            directorates={directorates}
            onTaskClick={openTaskDetail}
            onCreateTaskClick={openCreateTask}
          />
        );
      }}
    </AppShell>
  );
}
