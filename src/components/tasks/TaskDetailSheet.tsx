'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  User,
  Clock,
  Tag,
  Paperclip,
  Send,
  Trash2,
  CheckSquare,
  Square,
  MessageSquare,
  Shield,
  CheckCircle2,
  ExternalLink,
  AtSign,
  AlertTriangle,
} from 'lucide-react';
import { Task, TaskStatus, TaskComment, Directorate, User as UserType } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';

interface TaskDetailSheetProps {
  task: Task | null;
  onClose: () => void;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  directorates: Directorate[];
  users: UserType[];
}

export const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
  task,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
  directorates,
  users,
}) => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentTask, setCurrentTask] = useState<Task | null>(task);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');

  useEffect(() => {
    setCurrentTask(task);
    if (task) {
      const loadedComments = WorkspaceStorageService.getComments(task.id);
      setComments(loadedComments);
    }
  }, [task]);

  if (!currentTask) return null;

  const dir = directorates.find((d) => d.id === currentTask.directorateId) || {
    name: 'General',
    color: '#64748B',
    code: 'GEN',
  };

  const assignees = users.filter((u) => currentTask.assigneeIds.includes(u.id));

  const isOverdue =
    new Date(currentTask.dueDate).getTime() < new Date().getTime() &&
    currentTask.status !== 'completed';

  const handleStatusChange = (newStatus: TaskStatus) => {
    const updated = WorkspaceStorageService.updateTaskStatus(currentTask.id, newStatus);
    if (updated) {
      setCurrentTask(updated);
      onTaskUpdated(updated);
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = currentTask.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    const updatedTask = { ...currentTask, subtasks: updatedSubtasks };
    const saved = WorkspaceStorageService.saveTask(updatedTask);
    setCurrentTask(saved);
    onTaskUpdated(saved);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle,
      completed: false,
    };
    const updatedTask = { ...currentTask, subtasks: [...currentTask.subtasks, newSub] };
    const saved = WorkspaceStorageService.saveTask(updatedTask);
    setCurrentTask(saved);
    onTaskUpdated(saved);
    setNewSubtaskTitle('');
  };

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewComment(val);

    const lastAtIndex = val.lastIndexOf('@');
    if (lastAtIndex !== -1 && lastAtIndex === val.length - 1) {
      setShowMentionDropdown(true);
      setMentionFilter('');
    } else if (lastAtIndex !== -1 && !val.substring(lastAtIndex).includes(' ')) {
      setShowMentionDropdown(true);
      setMentionFilter(val.substring(lastAtIndex + 1).toLowerCase());
    } else {
      setShowMentionDropdown(false);
    }
  };

  const insertMention = (user: UserType) => {
    const lastAtIndex = newComment.lastIndexOf('@');
    const prefix = newComment.substring(0, lastAtIndex);
    const mentionText = `@${user.displayName} `;
    setNewComment(prefix + mentionText);
    setShowMentionDropdown(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const added = WorkspaceStorageService.addComment(currentTask.id, 'usr-snow', newComment);
    setComments((prev) => [...prev, added]);
    setNewComment('');
    setShowMentionDropdown(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      WorkspaceStorageService.deleteTask(currentTask.id);
      onTaskDeleted(currentTask.id);
      onClose();
    }
  };

  const filteredMentionUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(mentionFilter) ||
      u.email.toLowerCase().includes(mentionFilter)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#1A1A2E] border-l border-white/10 h-full flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 text-xs font-bold rounded-lg text-white font-sans"
              style={{ backgroundColor: dir.color }}
            >
              {dir.name} ({dir.code})
            </span>
            {isOverdue && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40 rounded-md font-sans animate-pulse">
                <AlertTriangle className="w-3 h-3" /> OVERDUE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
              title="Delete Task"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Status Bar */}
          <div className="bg-black/40 border border-white/10 p-3 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider font-sans">Task Status</span>
              <span className="text-[11px] text-slate-400 font-sans">Tap to update status</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { id: 'todo', label: 'To Do', color: 'bg-slate-800 text-slate-300' },
                { id: 'in_progress', label: 'In Progress', color: 'bg-blue-600/30 text-blue-300 border-blue-500/40' },
                { id: 'review', label: 'QA / Review', color: 'bg-amber-600/30 text-amber-300 border-amber-500/40' },
                { id: 'completed', label: 'Completed', color: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40' },
              ].map((st) => {
                const isActive = currentTask.status === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleStatusChange(st.id as TaskStatus)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition font-sans ${
                      isActive
                        ? 'bg-[#E85D04] text-white border-[#E85D04] shadow-md scale-95'
                        : 'border-white/5 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">{currentTask.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-4 border border-white/10 rounded-2xl font-sans">
              {currentTask.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-black/40 p-4 border border-white/10 rounded-2xl font-sans">
            <div>
              <span className="text-slate-400 block mb-1 text-[11px] font-bold uppercase tracking-wider">Assignees</span>
              <div className="flex items-center gap-2 flex-wrap">
                {assignees.map((u) => (
                  <div key={u.id} className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.displayName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-slate-200 font-bold text-[11px]">{u.displayName.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1 text-[11px] font-bold uppercase tracking-wider">Due Date</span>
              <div className={`flex items-center gap-1.5 font-bold ${isOverdue ? 'text-red-400' : 'text-slate-200'}`}>
                <Calendar className="w-3.5 h-3.5 text-[#0099CC]" />
                {new Date(currentTask.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1 text-[11px] font-bold uppercase tracking-wider">Priority</span>
              <span className={`uppercase font-extrabold px-2 py-0.5 rounded text-[10px] ${
                currentTask.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                currentTask.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {currentTask.priority}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1 text-[11px] font-bold uppercase tracking-wider">Estimated Time</span>
              <span className="text-slate-200 font-bold">{currentTask.estimatedHours || 3} Hours</span>
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between font-sans">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#E85D04]" /> Action Checklist
              </span>
              <span className="text-[11px] text-[#0099CC]">
                {currentTask.subtasks.filter((s) => s.completed).length}/{currentTask.subtasks.length} Completed
              </span>
            </h3>

            <div className="space-y-2">
              {currentTask.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleToggleSubtask(st.id)}
                  className="flex items-center gap-3 p-3 bg-black/30 border border-white/10 rounded-xl hover:border-[#E85D04]/50 cursor-pointer transition"
                >
                  {st.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs font-sans ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add subtask checklist item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtask();
                }}
                className="flex-1 px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E85D04] font-sans"
              />
              <button
                onClick={handleAddSubtask}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition font-sans"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Real-time Task Comments & Mentions */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between font-sans">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#0099CC]" /> Discussion & Live @Mentions
              </span>
              <span className="text-[10px] text-slate-400">Type @ to mention team members</span>
            </h3>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic font-sans p-3 bg-black/20 rounded-xl border border-white/5">
                  No comments posted yet. Type below to start the thread.
                </p>
              ) : (
                comments.map((cmt) => {
                  const author = users.find((u) => u.id === cmt.authorId) || {
                    displayName: 'Team Member',
                    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                  };
                  return (
                    <div key={cmt.id} className="flex items-start gap-3 p-3.5 bg-black/40 border border-white/10 rounded-2xl font-sans">
                      <img
                        src={author.avatarUrl}
                        alt={author.displayName}
                        className="w-7 h-7 rounded-full object-cover mt-0.5 border border-white/10"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{author.displayName}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {cmt.content.split(/(@[\w\s()]+)/g).map((part, i) =>
                            part.startsWith('@') ? (
                              <span key={i} className="px-1.5 py-0.5 bg-[#0099CC]/30 text-[#0099CC] border border-[#0099CC]/50 rounded font-bold">
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Post Comment & @Mention Box */}
            <div className="relative">
              {showMentionDropdown && filteredMentionUsers.length > 0 && (
                <div className="absolute bottom-full mb-2 left-0 w-64 bg-[#1A1A2E] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10">
                    Tag Team Member
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-0.5">
                    {filteredMentionUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => insertMention(u)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-[#E85D04]/20 transition text-xs"
                      >
                        <img src={u.avatarUrl} alt={u.displayName} className="w-5 h-5 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-white block leading-none">{u.displayName}</span>
                          <span className="text-[10px] text-slate-400">{u.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Write a comment... (Type @ to tag a team member)"
                    value={newComment}
                    onChange={handleCommentInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment();
                    }}
                    className="w-full pl-3.5 pr-9 py-2.5 bg-black/60 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0099CC] font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMentionDropdown(!showMentionDropdown)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0099CC]"
                    title="Tag a team member"
                  >
                    <AtSign className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="p-2.5 bg-[#E85D04] hover:bg-[#d45203] disabled:opacity-50 text-white rounded-2xl transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
