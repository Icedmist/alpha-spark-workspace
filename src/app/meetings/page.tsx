'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { MeetingNotesView } from '../../components/meetings/MeetingNotesView';

export default function MeetingsPage() {
  return (
    <AppShell>
      {({ meetingNotes, directorates, users, currentUser, refreshData }) => (
        <MeetingNotesView
          meetingNotes={meetingNotes}
          directorates={directorates}
          users={users}
          currentUser={currentUser}
          onMeetingCreated={refreshData}
        />
      )}
    </AppShell>
  );
}
