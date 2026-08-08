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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const added = WorkspaceStorageService.addComment(currentTask.id, 'usr-snow', newComment);
    setComments((prev) => [...prev, added]);
    setNewComment('');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      WorkspaceStorageService.deleteTask(currentTask.id);
      onTaskDeleted(currentTask.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 text-xs font-semibold rounded text-white"
              style={{ backgroundColor: dir.color }}
            >
              {dir.name} ({dir.code})
            </span>
            <span className="text-xs text-slate-400">Task ID: {currentTask.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status selector */}
          <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-xs font-medium text-slate-400">Current Status:</span>
            <select
              value={currentTask.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="bg-slate-900 text-xs font-semibold text-slate-100 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review & QA</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100">{currentTask.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 border border-slate-800/80 rounded-xl">
              {currentTask.description}
            </p>
          </div>

          {/* Key Properties Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl">
            <div>
              <span className="text-slate-400 block mb-1">Assignees</span>
              <div className="flex items-center gap-2">
                {assignees.map((u) => (
                  <div key={u.id} className="flex items-center gap-1.5">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.displayName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-slate-200 font-medium">{u.displayName.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Due Date</span>
              <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {new Date(currentTask.dueDate).toLocaleDateString()}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Priority</span>
              <span className="uppercase font-bold text-slate-200">{currentTask.priority}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Est. Time</span>
              <span className="text-slate-200 font-medium">{currentTask.estimatedHours || 3} Hours</span>
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-400" /> Action Checklist ({currentTask.subtasks.filter((s) => s.completed).length}/{currentTask.subtasks.length})
            </h3>

            <div className="space-y-2">
              {currentTask.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleToggleSubtask(st.id)}
                  className="flex items-center gap-3 p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-indigo-500/50 cursor-pointer transition"
                >
                  {st.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add new subtask item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtask();
                }}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Attachments */}
          {currentTask.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-indigo-400" /> Attachments ({currentTask.attachments.length})
              </h3>
              <div className="space-y-2">
                {currentTask.attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200">
                    <span className="font-medium truncate">{att.name} ({att.size})</span>
                    <a href="#" className="text-indigo-400 hover:underline flex items-center gap-1">
                      Download <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Discussion Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-400" /> Team Discussion & Updates
            </h3>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No comments yet. Start the conversation!</p>
              ) : (
                comments.map((cmt) => {
                  const author = users.find((u) => u.id === cmt.authorId) || {
                    displayName: 'Team Member',
                    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                  };
                  return (
                    <div key={cmt.id} className="flex items-start gap-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                      <img
                        src={author.avatarUrl}
                        alt={author.displayName}
                        className="w-7 h-7 rounded-full object-cover mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">{author.displayName}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{cmt.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Post comment form */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment();
                }}
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
