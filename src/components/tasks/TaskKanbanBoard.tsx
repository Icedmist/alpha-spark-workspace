'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  Paperclip,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Task, TaskStatus, Directorate, User as UserType, TaskPriority } from '../../types';

interface TaskKanbanBoardProps {
  tasks: Task[];
  directorates: Directorate[];
  users: UserType[];
  selectedDirectorateId?: string;
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onCreateTaskClick: () => void;
}

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({
  tasks,
  directorates,
  users,
  selectedDirectorateId,
  onTaskClick,
  onStatusChange,
  onCreateTaskClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dirFilter, setDirFilter] = useState<string>(selectedDirectorateId || 'all');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesDir = dirFilter === 'all' || t.directorateId === dirFilter;

    return matchesSearch && matchesPriority && matchesDir;
  });

  const columns: { id: TaskStatus; title: string; color: string; badgeBg: string; nextStatus?: TaskStatus; prevStatus?: TaskStatus }[] = [
    { id: 'todo', title: 'To Do', color: 'border-white/10', badgeBg: 'bg-white/10 text-slate-300', nextStatus: 'in_progress' },
    { id: 'in_progress', title: 'In Progress', color: 'border-[#0099CC]/40', badgeBg: 'bg-[#0099CC]/20 text-[#0099CC] border border-[#0099CC]/30', prevStatus: 'todo', nextStatus: 'review' },
    { id: 'review', title: 'Review & QA', color: 'border-[#F4A261]/40', badgeBg: 'bg-[#F4A261]/20 text-[#F4A261] border border-[#F4A261]/30', prevStatus: 'in_progress', nextStatus: 'completed' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', prevStatus: 'review' },
  ];

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse font-sans">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/30 font-sans">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-[#0099CC]/20 text-[#0099CC] border border-[#0099CC]/30 font-sans">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-white/10 text-slate-400 font-sans">Low</span>;
    }
  };

  const getDirectorateInfo = (dirId: string) => {
    return directorates.find((d) => d.id === dirId) || { name: 'General', color: '#64748B', code: 'GEN' };
  };

  return (
    <div className="p-6 space-y-6 animate-in font-sans">
      {/* Search & Filtering Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1A2E]/80 border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E85D04] transition font-sans"
            />
          </div>

          {/* Directorate Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#0099CC]" />
            <select
              value={dirFilter}
              onChange={(e) => setDirFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#0099CC] transition font-sans"
            >
              <option value="all">All Directorates ({tasks.length})</option>
              {directorates.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#0099CC] transition font-sans"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button
          onClick={onCreateTaskClick}
          className="px-4 py-2 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg glow-orange font-sans"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const columnTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col bg-[#1A1A2E]/60 border border-white/10 rounded-2xl p-4 min-h-[600px] backdrop-blur-xl ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 font-sans">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-sm text-white uppercase italic tracking-wider">{col.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-black rounded-full ${col.badgeBg}`}>
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  onClick={onCreateTaskClick}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                  title="Add Task to column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {columnTasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-white/10 rounded-xl p-4 font-sans">
                    <p className="text-xs font-bold">No tasks in {col.title}</p>
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const dir = getDirectorateInfo(task.directorateId);
                    const isOverdue =
                      new Date(task.dueDate).getTime() < Date.now() && task.status !== 'completed';
                    const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="group relative bg-black/40 border border-white/10 hover:border-[#E85D04]/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer space-y-3 backdrop-blur-md font-sans"
                      >
                        {/* Top Metadata */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="px-2 py-0.5 text-[10px] font-extrabold rounded-md text-white shadow-sm font-sans"
                            style={{ backgroundColor: dir.color }}
                          >
                            {dir.code}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isOverdue && (
                              <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40 rounded flex items-center gap-1 animate-pulse font-sans">
                                <AlertTriangle className="w-3 h-3" /> OVERDUE
                              </span>
                            )}
                            {getPriorityBadge(task.priority)}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-[#F4A261] transition line-clamp-2">
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        {/* Subtasks & Attachments count */}
                        {(task.subtasks.length > 0 || task.attachments.length > 0) && (
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                            {task.subtasks.length > 0 && (
                              <div className="flex items-center gap-1">
                                <CheckSquare className="w-3.5 h-3.5 text-[#0099CC]" />
                                <span>
                                  {completedSubtasks}/{task.subtasks.length}
                                </span>
                              </div>
                            )}
                            {task.attachments.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                                <span>{task.attachments.length}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 text-[10px] font-semibold bg-white/5 text-slate-300 rounded-md border border-white/5"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bottom Bar: Due Date & Mobile Touch One-Tap Move Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <div
                            className={`flex items-center gap-1.5 ${
                              isOverdue ? 'text-red-400 font-bold' : 'text-slate-400'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">
                              {new Date(task.dueDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1"
                          >
                            {col.prevStatus && (
                              <button
                                onClick={() => onStatusChange(task.id, col.prevStatus!)}
                                className="p-1 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
                                title="Move back"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <select
                              value={task.status}
                              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                              className="bg-black/60 text-[10px] font-bold text-slate-300 border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:border-[#E85D04]"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="completed">Completed</option>
                            </select>
                            {col.nextStatus && (
                              <button
                                onClick={() => onStatusChange(task.id, col.nextStatus!)}
                                className="p-1 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
                                title="Advance forward"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
