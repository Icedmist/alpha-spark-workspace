'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { ReportsView } from '../../components/reports/ReportsView';

export default function AnalyticsPage() {
  return (
    <AppShell>
      {({ tasks, directorates, users, currentUser }) => (
        <ReportsView
          tasks={tasks}
          directorates={directorates}
          users={users}
          currentUser={currentUser}
        />
      )}
    </AppShell>
  );
}
