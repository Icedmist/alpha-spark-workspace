'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { SuperAdminView } from '../../components/admin/SuperAdminView';

export default function AdminPage() {
  return (
    <AppShell>
      {({ users, directorates, tasks, currentUser, refreshData }) => (
        <SuperAdminView
          users={users}
          directorates={directorates}
          tasks={tasks}
          currentUser={currentUser}
          onUsersUpdated={refreshData}
        />
      )}
    </AppShell>
  );
}
