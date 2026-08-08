'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { DashboardView } from '../components/dashboard/DashboardView';
import { TaskKanbanBoard } from '../components/tasks/TaskKanbanBoard';
import { TaskListView } from '../components/tasks/TaskListView';
import { DirectorateGrid } from '../components/directorates/DirectorateGrid';
import { CalendarView } from '../components/calendar/CalendarView';
import { MeetingNotesView } from '../components/meetings/MeetingNotesView';
import { AnnouncementsView } from '../components/announcements/AnnouncementsView';
import { ReportsView } from '../components/reports/ReportsView';
import { AICommandModal } from '../components/ai/AICommandModal';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskDetailSheet } from '../components/tasks/TaskDetailSheet';
import { AuthModal } from '../components/auth/AuthModal';
import { WorkspaceStorageService } from '../lib/storage';
import { FirestoreService } from '../lib/firestoreService';
import {
  Task,
  TaskStatus,
  Directorate,
  User,
  Workspace,
  MeetingNote,
} from '../types';
import { Kanban, List } from 'lucide-react';

type ViewId =
  | 'dashboard'
  | 'tasks'
  | 'directorates'
  | 'calendar'
  | 'meetings'
  | 'announcements'
  | 'analytics';

function AlphaSparkContent() {
  const { userProfile } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [taskViewMode, setTaskViewMode] = useState<'kanban' | 'list'>('kanban');

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [selectedDirectorateId, setSelectedDirectorateId] = useState<string | undefined>();

  // Modals state
  const [showAICommand, setShowAICommand] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  useEffect(() => {
    WorkspaceStorageService.initSeedData();

    const wsId = WorkspaceStorageService.getCurrentWorkspaceId();
    const allWs = WorkspaceStorageService.getWorkspaces();
    const ws = allWs.find((w) => w.id === wsId) ?? allWs[0];
    setWorkspace(ws);

    // Initial state loading
    const allUsers = WorkspaceStorageService.getUsers();
    setUsers(allUsers);

    setDirectorates(WorkspaceStorageService.getDirectorates());
    setTasks(WorkspaceStorageService.getTasks());
    setMeetingNotes(WorkspaceStorageService.getMeetings());

    // Subscribe to Firestore Realtime Updates
    const unsubTasks = FirestoreService.subscribeTasks((realtimeTasks) => {
      if (realtimeTasks && realtimeTasks.length > 0) {
        setTasks(realtimeTasks);
      }
    });

    const unsubUsers = FirestoreService.subscribeUsers((realtimeUsers) => {
      if (realtimeUsers && realtimeUsers.length > 0) {
        setUsers(realtimeUsers);
      }
    });

    const unsubDirs = FirestoreService.subscribeDirectorates((realtimeDirs) => {
      if (realtimeDirs && realtimeDirs.length > 0) {
        setDirectorates(realtimeDirs);
      }
    });

    const unsubMeetings = FirestoreService.subscribeMeetings((realtimeMeetings) => {
      if (realtimeMeetings && realtimeMeetings.length > 0) {
        setMeetingNotes(realtimeMeetings);
      }
    });

    setIsReady(true);

    return () => {
      unsubTasks();
      unsubUsers();
      unsubDirs();
      unsubMeetings();
    };
  }, []);

  useEffect(() => {
    if (userProfile) {
      setCurrentUser(userProfile);
    } else {
      const allUsers = WorkspaceStorageService.getUsers();
      const defaultUser = allUsers.find((u) => u.role === 'super_admin') ?? allUsers[0];
      setCurrentUser(defaultUser);
    }
  }, [userProfile]);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowAICommand(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const refreshTasks = useCallback(() => {
    setTasks(WorkspaceStorageService.getTasks());
  }, []);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updated = WorkspaceStorageService.updateTaskStatus(taskId, newStatus);
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    }
  };

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)]);
    setShowCreateTask(false);
  };

  const handleTaskUpdated = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setDetailTaskId(null);
  };

  const openDetail = (task: Task) => setDetailTaskId(task.id);

  if (!isReady || !workspace || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1A1A2E]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E85D04] via-[#F4A261] to-[#0099CC] flex items-center justify-center animate-pulse shadow-lg glow-orange">
            <span className="text-white font-extrabold text-base italic font-display">AS</span>
          </div>
          <p className="text-xs text-slate-300 font-bold tracking-widest uppercase italic">
            Loading AminApps Alpha Spark Workspace...
          </p>
        </div>
      </div>
    );
  }

  const detailTask = detailTaskId
    ? tasks.find((t) => t.id === detailTaskId) ?? null
    : null;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            tasks={tasks}
            directorates={directorates}
            users={users}
            currentUser={currentUser}
            currentWorkspace={workspace}
            onOpenAICommand={() => setShowAICommand(true)}
            onOpenCreateTask={() => setShowCreateTask(true)}
            onNavigate={(v) => setCurrentView(v as ViewId)}
          />
        );

      case 'tasks':
        return (
          <div className="flex flex-col flex-1 min-h-0">
            {/* View mode toggle */}
            <div className="flex items-center gap-2 px-6 pt-5 pb-3">
              {([
                { id: 'kanban', label: 'Kanban Board', Icon: Kanban },
                { id: 'list', label: 'List Matrix', Icon: List },
              ] as const).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTaskViewMode(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition ${
                    taskViewMode === id
                      ? 'bg-[#E85D04]/20 text-white border-[#E85D04]/50 shadow-md'
                      : 'text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${taskViewMode === id ? 'text-[#E85D04]' : 'text-slate-400'}`} />
                  {label}
                </button>
              ))}
            </div>

            {taskViewMode === 'kanban' ? (
              <TaskKanbanBoard
                tasks={tasks}
                directorates={directorates}
                users={users}
                selectedDirectorateId={selectedDirectorateId}
                onTaskClick={openDetail}
                onStatusChange={handleStatusChange}
                onCreateTaskClick={() => setShowCreateTask(true)}
              />
            ) : (
              <TaskListView
                tasks={tasks}
                directorates={directorates}
                users={users}
                onTaskClick={openDetail}
                onStatusChange={handleStatusChange}
                onCreateTaskClick={() => setShowCreateTask(true)}
              />
            )}
          </div>
        );

      case 'directorates':
        return (
          <DirectorateGrid
            directorates={directorates}
            tasks={tasks}
            users={users}
            onSelectDirectorate={(id) => {
              setSelectedDirectorateId(id);
              setCurrentView('tasks');
            }}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            tasks={tasks}
            directorates={directorates}
            onTaskClick={openDetail}
            onCreateTaskClick={() => setShowCreateTask(true)}
          />
        );

      case 'meetings':
        return (
          <MeetingNotesView
            meetingNotes={meetingNotes}
            directorates={directorates}
            users={users}
            onTaskCreated={(task) => {
              handleTaskCreated(task);
              setMeetingNotes(WorkspaceStorageService.getMeetings());
            }}
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

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#1A1A2E] text-[#F5F5F5]">
      {/* Sidebar */}
      <Sidebar
        directorates={directorates}
        tasks={tasks}
        selectedDirectorateId={selectedDirectorateId}
        onSelectDirectorate={setSelectedDirectorateId}
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v as ViewId)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onOpenAICommand={() => setShowAICommand(true)}
          onOpenCreateTask={() => setShowCreateTask(true)}
          onOpenWorkspaceModal={() => {}}
          onOpenAuthModal={() => setShowAuthModal(true)}
          currentUser={currentUser}
          currentWorkspace={workspace}
        />

        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showAICommand && (
        <AICommandModal
          isOpen={showAICommand}
          onClose={() => setShowAICommand(false)}
          onTaskCreatedOrUpdated={(task) => {
            handleTaskUpdated(task);
            refreshTasks();
          }}
          onFilterOverdue={() => {
            setCurrentView('tasks');
            setShowAICommand(false);
          }}
          onGenerateReport={() => {
            setCurrentView('analytics');
            setShowAICommand(false);
          }}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          isOpen={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          directorates={directorates}
          users={users}
          onTaskCreated={handleTaskCreated}
        />
      )}

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

export default function AlphaSparkApp() {
  return (
    <AuthProvider>
      <AlphaSparkContent />
    </AuthProvider>
  );
}
