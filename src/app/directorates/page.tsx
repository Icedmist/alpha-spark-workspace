'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/layout/AppShell';
import { DirectorateGrid } from '../../components/directorates/DirectorateGrid';

export default function DirectoratesPage() {
  const router = useRouter();

  return (
    <AppShell>
      {({ directorates, tasks, users, currentUser, setSelectedDirectorateId, refreshData }) => (
        <DirectorateGrid
          directorates={directorates}
          tasks={tasks}
          users={users}
          currentUser={currentUser}
          onSelectDirectorate={(dirId) => {
            setSelectedDirectorateId(dirId);
            router.push('/tasks');
          }}
          onDirectorateCreated={refreshData}
        />
      )}
    </AppShell>
  );
}
