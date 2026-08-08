export type WorkspacePlan = 'free' | 'pro' | 'enterprise';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  logoUrl?: string;
  planTier: WorkspacePlan;
  createdAt: string;
}

export type UserRole = 'super_admin' | 'directorate_lead' | 'member';

export interface User {
  id: string;
  workspaceId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  directorateIds: string[];
  title: string;
}

export interface Directorate {
  id: string;
  workspaceId: string;
  name: string;
  code: string;
  description: string;
  leadId: string;
  memberIds: string[];
  color: string;
  icon: string;
}

export type TaskCategory =
  | 'teaching'
  | 'student_support'
  | 'software_dev'
  | 'graphic_design'
  | 'marketing'
  | 'finance'
  | 'hr'
  | 'operations'
  | 'event'
  | 'procurement'
  | 'executive'
  | 'custom';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  category: TaskCategory;
  directorateId: string;
  assigneeIds: string[];
  createdBy: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // ISO String
  estimatedHours?: number;
  attachments: Attachment[];
  subtasks: SubTask[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  workspaceId: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface MeetingNote {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  directorateId: string;
  attendeeIds: string[];
  date: string;
  actionItems: {
    title: string;
    assigneeName?: string;
    dueDate?: string;
    createdTaskId?: string;
  }[];
  createdAt: string;
}

export interface Announcement {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  authorId: string;
  targetDirectorateIds: string[];
  priority: 'normal' | 'urgent';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: 'task' | 'directorate' | 'meeting' | 'announcement' | 'report' | 'user';
  targetTitle: string;
  timestamp: string;
}

export interface WeeklyReport {
  id: string;
  workspaceId: string;
  title: string;
  period: string;
  completedTaskCount: number;
  inProgressTaskCount: number;
  overdueTaskCount: number;
  directorateBreakdown: { directorateName: string; completed: number; total: number }[];
  summaryText: string;
  highlights: string[];
  createdAt: string;
}

export interface AICommandParseResult {
  intent: 'create_task' | 'update_status' | 'assign_task' | 'filter_overdue' | 'generate_report' | 'unknown';
  naturalLanguageCommand: string;
  extractedTask?: Partial<Task> & { assigneeNames?: string[] };
  targetTaskTitle?: string;
  updatedTaskId?: string;
  newStatus?: TaskStatus;
  timeframe?: string;
  explanation: string;
}
