'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { TaskKanbanBoard } from '../components/tasks/TaskKanbanBoard';
import { TaskListView } from '../components/tasks/TaskListView';
import { CalendarView } from '../components/calendar/CalendarView';
import { DirectorateGrid } from '../components/directorates/DirectorateGrid';
import { MeetingNotesView } from '../components/meetings/MeetingNotesView';
import { AnnouncementsView } from '../components/announcements/AnnouncementsView';
import { ReportsView } from '../components/reports/ReportsView';
import { SuperAdminView } from '../components/admin/SuperAdminView';
import { AICommandModal } from '../components/ai/AICommandModal';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskDetailSheet } from '../components/tasks/TaskDetailSheet';
import { AuthModal } from '../components/auth/AuthModal';
import { LoginView } from '../components/auth/LoginView';
import { OnboardingGuide } from '../components/onboarding/OnboardingGuide';

import { Task, Directorate, User, Workspace, MeetingNote } from '../types';
import { WorkspaceStorageService } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export type ViewId = 'kanban' | 'tasks' | 'list' | 'calendar' | 'directorates' | 'meetings' | 'announcements' | 'analytics' | 'admin';

export default function Home() {
  const { user: authUser, userProfile, loading } = useAuth();

  const [workspace, setWorkspace] = useState<Workspace>({
    id: 'ws-alpha-spark',
    name: 'Alpha Spark Global',
    slug: 'alpha-spark',
    ownerId: 'usr-snow',
    logoUrl: '/logo.png',
    planTier: 'enterprise',
    createdAt: new Date().toISOString(),
  });

  const [currentView, setCurrentView] = useState<ViewId>('kanban');
  const [selectedDirectorateId, setSelectedDirectorateId] = useState<string | undefined>(undefined);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);

  // Modal / Sheet States
  const [showAICommand, setShowAICommand] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Initialize data from LocalStorage/Defaults
  useEffect(() => {
    setTasks(WorkspaceStorageService.getTasks());
    setDirectorates(WorkspaceStorageService.getDirectorates());
    setUsers(WorkspaceStorageService.getUsers());
    setMeetingNotes(WorkspaceStorageService.getMeetings());

    // Auto-open onboarding for first-time visitors once authenticated
    const completed = localStorage.getItem('alpha_spark_onboarding_completed_v1');
    if (!completed && (authUser || userProfile)) {
      setShowGuide(true);
    }
  }, [authUser, userProfile]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E85D04] to-[#F4A261] flex items-center justify-center shadow-lg glow-orange animate-bounce">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Alpha Spark OS...</p>
        </div>
      </div>
    );
  }

  // Require Auth Guard: Render Login Screen before showing data
  if (!authUser && !userProfile) {
    return <LoginView />;
  }

  const currentUser: User = userProfile || {
    id: authUser?.uid || 'usr-snow',
    workspaceId: 'ws-alpha-spark',
    displayName: authUser?.displayName || authUser?.email?.split('@')[0] || 'Snow',
    email: authUser?.email || 'talk2icedmist@gmail.com',
    role: authUser?.email?.toLowerCase() === 'talk2icedmist@gmail.com' ? 'super_admin' : 'member',
    directorateIds: ['dir-dev', 'dir-exec'],
    avatarUrl: authUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: authUser?.email?.toLowerCase() === 'talk2icedmist@gmail.com' ? 'Super Admin' : 'Workspace Member',
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(WorkspaceStorageService.getTasks());
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(WorkspaceStorageService.getTasks());
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(WorkspaceStorageService.getTasks());
  };

  const openDetail = (task: Task) => {
    setDetailTaskId(task.id);
  };

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem('alpha_spark_onboarding_completed_v1', 'true');
  };

  const detailTask = tasks.find((t) => t.id === detailTaskId) || null;

  // Filter tasks if directorate selected
  const filteredTasks = selectedDirectorateId
    ? tasks.filter((t) => t.directorateId === selectedDirectorateId)
    : tasks;

  const renderView = () => {
    switch (currentView) {
      case 'kanban':
      case 'tasks':
        return (
          <TaskKanbanBoard
            tasks={filteredTasks}
            directorates={directorates}
            users={users}
            selectedDirectorateId={selectedDirectorateId}
            onTaskClick={openDetail}
            onStatusChange={(taskId, newStatus) => {
              WorkspaceStorageService.updateTaskStatus(taskId, newStatus);
              setTasks(WorkspaceStorageService.getTasks());
            }}
            onCreateTaskClick={() => setShowCreateTask(true)}
          />
        );

      case 'list':
        return (
          <TaskListView
            tasks={filteredTasks}
            directorates={directorates}
            users={users}
            onTaskClick={openDetail}
            onStatusChange={(taskId, newStatus) => {
              WorkspaceStorageService.updateTaskStatus(taskId, newStatus);
              setTasks(WorkspaceStorageService.getTasks());
            }}
            onCreateTaskClick={() => setShowCreateTask(true)}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            tasks={filteredTasks}
            directorates={directorates}
            onTaskClick={openDetail}
            onCreateTaskClick={() => setShowCreateTask(true)}
          />
        );

      case 'directorates':
        return (
          <DirectorateGrid
            directorates={directorates}
            tasks={tasks}
            users={users}
            onSelectDirectorate={(dirId) => {
              setSelectedDirectorateId(dirId);
              setCurrentView('kanban');
            }}
          />
        );

      case 'meetings':
        return (
          <MeetingNotesView
            meetingNotes={meetingNotes}
            directorates={directorates}
            users={users}
            currentUser={currentUser}
            onMeetingCreated={() => setMeetingNotes(WorkspaceStorageService.getMeetings())}
          />
        );

      case 'announcements':
        return (
          <AnnouncementsView
            directorates={directorates}
            users={users}
            currentUser={currentUser}
          />
        );

      case 'analytics':
        return (
          <ReportsView
            tasks={tasks}
            directorates={directorates}
            users={users}
            currentUser={currentUser}
          />
        );

      case 'admin':
        return (
          <SuperAdminView
            users={users}
            directorates={directorates}
            tasks={tasks}
            currentUser={currentUser}
            onUsersUpdated={() => setUsers(WorkspaceStorageService.getUsers())}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#1A1A2E] text-[#F5F5F5] font-sans selection:bg-[#E85D04] selection:text-white">
      <Sidebar
        directorates={directorates}
        tasks={tasks}
        selectedDirectorateId={selectedDirectorateId}
        onSelectDirectorate={(id) => {
          setSelectedDirectorateId(id);
          if (currentView !== 'tasks' && currentView !== 'kanban') setCurrentView('kanban');
        }}
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v as ViewId)}
        currentUser={currentUser}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          onOpenAICommand={() => setShowAICommand(true)}
          onOpenCreateTask={() => setShowCreateTask(true)}
          onOpenWorkspaceModal={() => {}}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onOpenGuide={() => setShowGuide(true)}
          currentUser={currentUser}
          currentWorkspace={workspace}
        />

        <main className="flex-1 flex flex-col min-h-0 bg-grid">
          {renderView()}
        </main>
      </div>

      {/* Modals & Tour */}
      <OnboardingGuide
        isOpen={showGuide}
        onClose={closeGuide}
        onNavigateToAdmin={() => setCurrentView('admin')}
        onOpenAICommand={() => setShowAICommand(true)}
      />

      <AICommandModal
        isOpen={showAICommand}
        onClose={() => setShowAICommand(false)}
        onTaskCreatedOrUpdated={handleTaskCreated}
        onFilterOverdue={() => {
          setCurrentView('kanban');
        }}
        onGenerateReport={() => {
          setCurrentView('analytics');
        }}
      />

      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onTaskCreated={handleTaskCreated}
        directorates={directorates}
        users={users}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {detailTask && (
        <TaskDetailSheet
          task={detailTask}
          directorates={directorates}
          users={users}
          onClose={() => setDetailTaskId(null)}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  );
}
