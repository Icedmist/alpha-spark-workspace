'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AICommandModal } from '../ai/AICommandModal';
import { CreateTaskModal } from '../tasks/CreateTaskModal';
import { TaskDetailSheet } from '../tasks/TaskDetailSheet';
import { AuthModal } from '../auth/AuthModal';
import { LoginView } from '../auth/LoginView';
import { OnboardingGuide } from '../onboarding/OnboardingGuide';

import { Task, Directorate, User, Workspace, MeetingNote } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface AppShellProps {
  children: (props: {
    tasks: Task[];
    directorates: Directorate[];
    users: User[];
    meetingNotes: MeetingNote[];
    selectedDirectorateId?: string;
    setSelectedDirectorateId: (id?: string) => void;
    currentUser: User;
    openTaskDetail: (task: Task) => void;
    openCreateTask: () => void;
    refreshData: () => void;
  }) => React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const router = useRouter();
  const { user: authUser, userProfile, loading } = useAuth();

  const [workspace] = useState<Workspace>({
    id: 'ws-alpha-spark',
    name: 'Alpha Spark Global',
    slug: 'alpha-spark',
    ownerId: 'usr-snow',
    logoUrl: '/assets/logo.png',
    planTier: 'enterprise',
    createdAt: new Date().toISOString(),
  });

  const [selectedDirectorateId, setSelectedDirectorateId] = useState<string | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);

  // Modals / Sheets
  const [showAICommand, setShowAICommand] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const refreshData = () => {
    setTasks(WorkspaceStorageService.getTasks());
    setDirectorates(WorkspaceStorageService.getDirectorates());
    setUsers(WorkspaceStorageService.getUsers());
    setMeetingNotes(WorkspaceStorageService.getMeetings());
  };

  useEffect(() => {
    refreshData();
    const completed = localStorage.getItem('alpha_spark_onboarding_completed_v1');
    if (!completed && (authUser || userProfile)) {
      setShowGuide(true);
    }
  }, [authUser, userProfile]);

  // Global Hotkey Listener (⌘K for commands, N for new task, Esc for closing modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey: ⌘K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowAICommand((prev) => !prev);
      }
      // Hotkey: N -> New Task (when not typing in an input/textarea)
      if (
        e.key.toLowerCase() === 'n' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) &&
        !showCreateTask &&
        !showAICommand
      ) {
        e.preventDefault();
        setShowCreateTask(true);
      }
      // Hotkey: Esc -> Close active modal/sheet
      if (e.key === 'Escape') {
        setShowAICommand(false);
        setShowCreateTask(false);
        setDetailTaskId(null);
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateTask, showAICommand]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E85D04] flex items-center justify-center shadow-lg glow-orange animate-bounce">
            <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Loading Alpha Spark OS...</p>
        </div>
      </div>
    );
  }

  if (!authUser && !userProfile) {
    return <LoginView />;
  }

  const currentUser: User = userProfile || {
    id: authUser?.uid || 'usr-snow',
    workspaceId: 'ws-alpha-spark',
    displayName: authUser?.displayName || authUser?.email?.split('@')[0] || 'Snow (Icedmist)',
    email: authUser?.email || 'talk2icedmist@gmail.com',
    role: authUser?.email?.toLowerCase() === 'talk2icedmist@gmail.com' ? 'super_admin' : 'member',
    directorateIds: ['dir-dev', 'dir-exec'],
    avatarUrl: authUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: authUser?.email?.toLowerCase() === 'talk2icedmist@gmail.com' ? 'Super Admin' : 'Workspace Member',
  };

  const handleTaskCreated = () => {
    refreshData();
  };

  const handleTaskUpdated = () => {
    refreshData();
  };

  const handleTaskDeleted = () => {
    refreshData();
  };

  const openTaskDetail = (task: Task) => {
    setDetailTaskId(task.id);
  };

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem('alpha_spark_onboarding_completed_v1', 'true');
  };

  const detailTask = tasks.find((t) => t.id === detailTaskId) || null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#1A1A2E] text-[#F5F5F5] font-sans selection:bg-[#E85D04] selection:text-white">
      <Sidebar
        directorates={directorates}
        tasks={tasks}
        selectedDirectorateId={selectedDirectorateId}
        onSelectDirectorate={(id) => {
          setSelectedDirectorateId(id);
          router.push('/tasks');
        }}
        currentUser={currentUser}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          onOpenAICommand={() => setShowAICommand(true)}
          onOpenCreateTask={() => setShowCreateTask(true)}
          onOpenWorkspaceModal={() => {}}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onOpenGuide={() => setShowGuide(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          currentUser={currentUser}
          currentWorkspace={workspace}
        />

        <main className="flex-1 flex flex-col min-h-0 bg-grid">
          {children({
            tasks,
            directorates,
            users,
            meetingNotes,
            selectedDirectorateId,
            setSelectedDirectorateId,
            currentUser,
            openTaskDetail,
            openCreateTask: () => setShowCreateTask(true),
            refreshData,
          })}
        </main>
      </div>

      {/* Modals & Overlays */}
      <OnboardingGuide
        isOpen={showGuide}
        onClose={closeGuide}
        onNavigateToAdmin={() => router.push('/admin')}
        onOpenAICommand={() => setShowAICommand(true)}
      />

      <AICommandModal
        isOpen={showAICommand}
        onClose={() => setShowAICommand(false)}
        onTaskCreatedOrUpdated={handleTaskCreated}
        onFilterOverdue={() => router.push('/tasks')}
        onGenerateReport={() => router.push('/analytics')}
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
};
