'use client';

import React, { useState } from 'react';
import {
  List,
  Grid,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  MoreVertical,
  CheckSquare,
  ArrowUpDown,
  FileText,
} from 'lucide-react';
import { Task, TaskStatus, Directorate, User as UserType, TaskPriority } from '../../types';

interface TaskListViewProps {
  tasks: Task[];
  directorates: Directorate[];
  users: UserType[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onCreateTaskClick: () => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  directorates,
  users,
  onTaskClick,
  onStatusChange,
  onCreateTaskClick,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  const getDirectorateInfo = (dirId: string) => {
    return directorates.find((d) => d.id === dirId) || { name: 'General', color: '#64748B', code: 'GEN' };
  };

  const getUserAvatars = (assigneeIds: string[]) => {
    return assigneeIds.map((id) => users.find((u) => u.id === id)).filter(Boolean) as UserType[];
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const pMap = { urgent: 4, high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    return a.title.localeCompare(b.title);
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-950 text-red-400 border border-red-800">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-950 text-amber-400 border border-amber-800">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-blue-950 text-blue-400 border border-blue-800">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-medium uppercase rounded bg-slate-800 text-slate-400">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">Completed</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-950 text-blue-400 border border-blue-800">In Progress</span>;
      case 'review':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-950 text-amber-400 border border-amber-800">Review</span>;
      case 'todo':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-400 border border-slate-700">To Do</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar & controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search task list..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={() =>
              setSortBy((prev) => (prev === 'dueDate' ? 'priority' : prev === 'priority' ? 'title' : 'dueDate'))
            }
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center gap-1.5 hover:bg-slate-800 transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" /> Sort by: {sortBy}
          </button>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-1 flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table List
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition ${
                viewMode === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Eisenhower Matrix
            </button>
          </div>

          <button
            onClick={onCreateTaskClick}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* VIEW 1: Table List */}
      {viewMode === 'list' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Task Title</th>
                  <th className="py-3.5 px-4">Directorate</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assignees</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {sortedTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No matching tasks found.
                    </td>
                  </tr>
                ) : (
                  sortedTasks.map((task) => {
                    const dir = getDirectorateInfo(task.directorateId);
                    const assignees = getUserAvatars(task.assigneeIds);
                    const isOverdue =
                      new Date(task.dueDate).getTime() < Date.now() && task.status !== 'completed';

                    return (
                      <tr
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="hover:bg-slate-800/40 transition cursor-pointer group"
                      >
                        {/* Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-semibold text-slate-100 group-hover:text-indigo-300 transition">
                              {task.title}
                            </span>
                            {task.subtasks.length > 0 && (
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <CheckSquare className="w-3 h-3 text-slate-400" />
                                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Directorate */}
                        <td className="py-3.5 px-4">
                          <span
                            className="px-2.5 py-1 text-xs font-semibold rounded-md text-white"
                            style={{ backgroundColor: dir.color }}
                          >
                            {dir.code}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={task.status}
                            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                            className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>

                        {/* Assignees */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center -space-x-2">
                            {assignees.map((user) => (
                              <img
                                key={user.id}
                                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                alt={user.displayName}
                                title={user.displayName}
                                className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover"
                              />
                            ))}
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-xs font-medium ${
                              isOverdue ? 'text-red-400 font-semibold' : 'text-slate-400'
                            }`}
                          >
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                            {isOverdue && ' (Overdue)'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onTaskClick(task)}
                            className="px-3 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-md text-xs font-medium transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Eisenhower Matrix */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quadrant 1: Urgent & High Priority */}
          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
              <h3 className="font-bold text-sm text-red-400 flex items-center gap-2">
                🔥 Quadrant 1: Urgent & High Priority (Do Now)
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-red-900 text-red-200 rounded-full">
                {filteredTasks.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed').length}
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed')
                .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="p-3.5 bg-slate-950 border border-red-900/50 rounded-xl hover:border-red-500 cursor-pointer transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-100">{task.title}</h4>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 2: Important but Not Urgent */}
          <div className="bg-blue-950/30 border border-blue-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
              <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
                📅 Quadrant 2: High Priority, Not Urgent (Schedule)
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-900 text-blue-200 rounded-full">
                {filteredTasks.filter((t) => t.priority === 'medium' && t.status !== 'completed').length}
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => t.priority === 'medium' && t.status !== 'completed')
                .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="p-3.5 bg-slate-950 border border-blue-900/50 rounded-xl hover:border-blue-500 cursor-pointer transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-100">{task.title}</h4>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 3: Urgent, Low Priority (Delegate) */}
          <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                🤝 Quadrant 3: Low Priority, Urgent (Delegate)
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-900 text-amber-200 rounded-full">
                {filteredTasks.filter((t) => t.priority === 'low' && t.status !== 'completed').length}
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => t.priority === 'low' && t.status !== 'completed')
                .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="p-3.5 bg-slate-950 border border-amber-900/50 rounded-xl hover:border-amber-500 cursor-pointer transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-100">{task.title}</h4>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 4: Completed Tasks */}
          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                ✅ Quadrant 4: Completed & Archival
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-900 text-emerald-200 rounded-full">
                {filteredTasks.filter((t) => t.status === 'completed').length}
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => t.status === 'completed')
                .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="p-3.5 bg-slate-950 border border-emerald-900/50 rounded-xl hover:border-emerald-500 cursor-pointer transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-100 line-through opacity-80">{task.title}</h4>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
