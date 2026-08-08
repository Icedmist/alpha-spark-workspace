import {
  Workspace,
  User,
  Directorate,
  Task,
  TaskComment,
  MeetingNote,
  Announcement,
  ActivityLog,
  TaskStatus,
} from '../types';
import {
  INITIAL_WORKSPACE,
  INITIAL_USERS,
  INITIAL_DIRECTORATES,
  INITIAL_TASKS,
  INITIAL_COMMENTS,
  INITIAL_MEETINGS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ACTIVITY,
} from './mockData';
import { FirestoreService } from './firestoreService';

const KEYS = {
  WORKSPACES: 'alpha_spark_workspaces_v1',
  CURRENT_WORKSPACE: 'alpha_spark_current_ws_id_v1',
  USERS: 'alpha_spark_users_v1',
  DIRECTORATES: 'alpha_spark_directorates_v1',
  TASKS: 'alpha_spark_tasks_v1',
  COMMENTS: 'alpha_spark_comments_v1',
  MEETINGS: 'alpha_spark_meetings_v1',
  ANNOUNCEMENTS: 'alpha_spark_announcements_v1',
  ACTIVITY: 'alpha_spark_activity_v1',
};

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export class WorkspaceStorageService {
  static initSeedData(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.WORKSPACES)) {
      setStorage(KEYS.WORKSPACES, [INITIAL_WORKSPACE]);
      setStorage(KEYS.CURRENT_WORKSPACE, INITIAL_WORKSPACE.id);
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      setStorage(KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(KEYS.DIRECTORATES)) {
      setStorage(KEYS.DIRECTORATES, INITIAL_DIRECTORATES);
    }
    if (!localStorage.getItem(KEYS.TASKS)) {
      setStorage(KEYS.TASKS, INITIAL_TASKS);
    }
    if (!localStorage.getItem(KEYS.COMMENTS)) {
      setStorage(KEYS.COMMENTS, INITIAL_COMMENTS);
    }
    if (!localStorage.getItem(KEYS.MEETINGS)) {
      setStorage(KEYS.MEETINGS, INITIAL_MEETINGS);
    }
    if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) {
      setStorage(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    }
    if (!localStorage.getItem(KEYS.ACTIVITY)) {
      setStorage(KEYS.ACTIVITY, INITIAL_ACTIVITY);
    }

    // Trigger Firestore seed check
    FirestoreService.seedInitialFirestoreData().catch(console.error);
  }

  static clearAndResetDatabase(): void {
    if (typeof window === 'undefined') return;
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
    setStorage(KEYS.WORKSPACES, [INITIAL_WORKSPACE]);
    setStorage(KEYS.CURRENT_WORKSPACE, INITIAL_WORKSPACE.id);
    setStorage(KEYS.USERS, INITIAL_USERS);
    setStorage(KEYS.DIRECTORATES, INITIAL_DIRECTORATES);
    setStorage(KEYS.TASKS, INITIAL_TASKS);
    setStorage(KEYS.COMMENTS, INITIAL_COMMENTS);
    setStorage(KEYS.MEETINGS, INITIAL_MEETINGS);
    setStorage(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    setStorage(KEYS.ACTIVITY, [
      {
        id: `act-${Date.now()}`,
        workspaceId: INITIAL_WORKSPACE.id,
        actorId: 'usr-snow',
        actorName: 'Snow (Icedmist)',
        action: 'reset and re-seeded workspace database',
        targetType: 'report',
        targetTitle: 'Clean Real Data System Reset',
        timestamp: new Date().toISOString(),
      },
      ...INITIAL_ACTIVITY,
    ]);
  }

  // Workspaces
  static getWorkspaces(): Workspace[] {
    return getStorage<Workspace[]>(KEYS.WORKSPACES, [INITIAL_WORKSPACE]);
  }

  static getCurrentWorkspaceId(): string {
    return getStorage<string>(KEYS.CURRENT_WORKSPACE, INITIAL_WORKSPACE.id);
  }

  static setCurrentWorkspaceId(id: string): void {
    setStorage(KEYS.CURRENT_WORKSPACE, id);
  }

  static createWorkspace(name: string, planTier: 'free' | 'pro' | 'enterprise' = 'pro'): Workspace {
    const workspaces = this.getWorkspaces();
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      ownerId: 'usr-snow',
      planTier,
      createdAt: new Date().toISOString(),
    };
    workspaces.push(newWs);
    setStorage(KEYS.WORKSPACES, workspaces);
    setStorage(KEYS.CURRENT_WORKSPACE, newWs.id);
    return newWs;
  }

  // Users
  static getUsers(wsId?: string): User[] {
    const all = getStorage<User[]>(KEYS.USERS, INITIAL_USERS);
    const targetWs = wsId || this.getCurrentWorkspaceId();
    return all.filter((u) => u.workspaceId === targetWs || u.workspaceId === 'ws-alpha-spark');
  }

  static saveUser(user: User): User {
    const all = getStorage<User[]>(KEYS.USERS, INITIAL_USERS);
    const idx = all.findIndex((u) => u.id === user.id);
    if (idx >= 0) all[idx] = user;
    else all.push(user);
    setStorage(KEYS.USERS, all);
    FirestoreService.saveUser(user).catch(console.error);
    return user;
  }

  // Directorates
  static getDirectorates(wsId?: string): Directorate[] {
    const all = getStorage<Directorate[]>(KEYS.DIRECTORATES, INITIAL_DIRECTORATES);
    const targetWs = wsId || this.getCurrentWorkspaceId();
    return all.filter((d) => d.workspaceId === targetWs || d.workspaceId === 'ws-alpha-spark');
  }

  // Tasks
  static getTasks(wsId?: string): Task[] {
    const all = getStorage<Task[]>(KEYS.TASKS, INITIAL_TASKS);
    const targetWs = wsId || this.getCurrentWorkspaceId();
    return all.filter((t) => t.workspaceId === targetWs || t.workspaceId === 'ws-alpha-spark');
  }

  static saveTask(task: Task): Task {
    const all = getStorage<Task[]>(KEYS.TASKS, INITIAL_TASKS);
    const index = all.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      all[index] = { ...task, updatedAt: new Date().toISOString() };
    } else {
      all.unshift(task);
    }
    setStorage(KEYS.TASKS, all);
    this.logActivity('updated task', 'task', task.title);

    // Sync to Firestore
    FirestoreService.saveTask(task).catch(console.error);
    return task;
  }

  static updateTaskStatus(taskId: string, status: TaskStatus): Task | null {
    const all = getStorage<Task[]>(KEYS.TASKS, INITIAL_TASKS);
    const task = all.find((t) => t.id === taskId);
    if (!task) return null;

    task.status = status;
    task.updatedAt = new Date().toISOString();
    setStorage(KEYS.TASKS, all);

    this.logActivity(`marked task as ${status.replace('_', ' ')}`, 'task', task.title);

    // Sync to Firestore
    FirestoreService.updateTaskStatus(taskId, status).catch(console.error);
    return task;
  }

  static addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const all = getStorage<Task[]>(KEYS.TASKS, INITIAL_TASKS);
    all.unshift(newTask);
    setStorage(KEYS.TASKS, all);

    this.logActivity('created task', 'task', newTask.title);

    // Sync to Firestore
    FirestoreService.saveTask(newTask).catch(console.error);
    return newTask;
  }

  static deleteTask(taskId: string): void {
    let all = getStorage<Task[]>(KEYS.TASKS, INITIAL_TASKS);
    all = all.filter((t) => t.id !== taskId);
    setStorage(KEYS.TASKS, all);
    FirestoreService.deleteTask(taskId).catch(console.error);
  }

  // Comments
  static getComments(taskId: string): TaskComment[] {
    const all = getStorage<TaskComment[]>(KEYS.COMMENTS, INITIAL_COMMENTS);
    return all.filter((c) => c.taskId === taskId);
  }

  static addComment(taskId: string, authorId: string, content: string): TaskComment {
    const newComment: TaskComment = {
      id: `cmt-${Date.now()}`,
      workspaceId: this.getCurrentWorkspaceId(),
      taskId,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    };
    const all = getStorage<TaskComment[]>(KEYS.COMMENTS, INITIAL_COMMENTS);
    all.push(newComment);
    setStorage(KEYS.COMMENTS, all);
    return newComment;
  }

  // Meetings
  static getMeetings(wsId?: string): MeetingNote[] {
    const all = getStorage<MeetingNote[]>(KEYS.MEETINGS, INITIAL_MEETINGS);
    const targetWs = wsId || this.getCurrentWorkspaceId();
    return all.filter((m) => m.workspaceId === targetWs || m.workspaceId === 'ws-alpha-spark');
  }

  static addMeeting(meeting: Omit<MeetingNote, 'id' | 'createdAt'>): MeetingNote {
    const newMtg: MeetingNote = {
      ...meeting,
      id: `mtg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const all = getStorage<MeetingNote[]>(KEYS.MEETINGS, INITIAL_MEETINGS);
    all.unshift(newMtg);
    setStorage(KEYS.MEETINGS, all);
    FirestoreService.saveMeeting(newMtg).catch(console.error);
    return newMtg;
  }

  // Announcements
  static getAnnouncements(wsId?: string): Announcement[] {
    const all = getStorage<Announcement[]>(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const targetWs = wsId || this.getCurrentWorkspaceId();
    return all.filter((a) => a.workspaceId === targetWs || a.workspaceId === 'ws-alpha-spark');
  }

  static addAnnouncement(anc: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
    const newAnc: Announcement = {
      ...anc,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const all = getStorage<Announcement[]>(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    all.unshift(newAnc);
    setStorage(KEYS.ANNOUNCEMENTS, all);
    return newAnc;
  }

  // Activity Log
  static getActivity(wsId?: string): ActivityLog[] {
    const all = getStorage<ActivityLog[]>(KEYS.ACTIVITY, INITIAL_ACTIVITY);
    const targetWs = wsId || this.getCurrentWorkspaceId();
    return all.filter((a) => a.workspaceId === targetWs || a.workspaceId === 'ws-alpha-spark');
  }

  static logActivity(action: string, targetType: ActivityLog['targetType'], targetTitle: string): void {
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      workspaceId: this.getCurrentWorkspaceId(),
      actorId: 'usr-snow',
      actorName: 'Snow (Icedmist)',
      action,
      targetType,
      targetTitle,
      timestamp: new Date().toISOString(),
    };
    const all = getStorage<ActivityLog[]>(KEYS.ACTIVITY, INITIAL_ACTIVITY);
    all.unshift(newAct);
    setStorage(KEYS.ACTIVITY, all.slice(0, 50));
  }
}
