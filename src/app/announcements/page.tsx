'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { AnnouncementsView } from '../../components/announcements/AnnouncementsView';

export default function AnnouncementsPage() {
  return (
    <AppShell>
      {({ directorates, users, currentUser }) => (
        <AnnouncementsView
          directorates={directorates}
          users={users}
          currentUser={currentUser}
        />
      )}
    </AppShell>
  );
}
