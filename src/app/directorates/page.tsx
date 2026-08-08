'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/layout/AppShell';
import { DirectorateGrid } from '../../components/directorates/DirectorateGrid';

export default function DirectoratesPage() {
  const router = useRouter();

  return (
    <AppShell>
      {({ directorates, tasks, users, setSelectedDirectorateId }) => (
        <DirectorateGrid
          directorates={directorates}
          tasks={tasks}
          users={users}
          onSelectDirectorate={(dirId) => {
            setSelectedDirectorateId(dirId);
            router.push('/tasks');
          }}
        />
      )}
    </AppShell>
  );
}
