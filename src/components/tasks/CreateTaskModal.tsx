'use client';

import React, { useState } from 'react';
import { X, Plus, Calendar, User, Tag, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Task, TaskPriority, TaskCategory, TaskStatus, Directorate, User as UserType } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';
import confetti from 'canvas-confetti';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  directorates: Directorate[];
  users: UserType[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  directorates,
  users,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [directorateId, setDirectorateId] = useState(directorates[0]?.id || 'dir-dev');
  const [category, setCategory] = useState<TaskCategory>('software_dev');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(['usr-snow']);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [estimatedHours, setEstimatedHours] = useState<number>(4);
  const [tagsInput, setTagsInput] = useState('Urgent, Phase-1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created = WorkspaceStorageService.addTask({
      workspaceId: WorkspaceStorageService.getCurrentWorkspaceId(),
      title: title.trim(),
      description: description.trim() || 'No detailed description provided.',
      category,
      directorateId,
      assigneeIds: selectedAssignees,
      createdBy: 'usr-snow',
      priority,
      status: 'todo',
      dueDate: new Date(dueDate).toISOString(),
      estimatedHours: Number(estimatedHours) || 4,
      attachments: [],
      subtasks: [
        { id: `st-${Date.now()}-1`, title: 'Kickoff requirement review', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Deliver completion signoff', completed: false },
      ],
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    });

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    onTaskCreated(created);
    onClose();

    // Reset fields
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Create New Workspace Task
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Conduct Student Cohort Orientation Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Directorate & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Directorate</label>
              <select
                value={directorateId}
                onChange={(e) => setDirectorateId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {directorates.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Task Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="software_dev">Software & Systems</option>
                <option value="teaching">Teaching & Academics</option>
                <option value="graphic_design">Graphic & UI Design</option>
                <option value="marketing">Marketing & Outreach</option>
                <option value="finance">Finance & Auditing</option>
                <option value="procurement">Procurement & Logistics</option>
                <option value="custom">Custom Task</option>
              </select>
            </div>
          </div>

          {/* Assignees & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assignee</label>
              <select
                value={selectedAssignees[0]}
                onChange={(e) => setSelectedAssignees([e.target.value])}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Critical</option>
              </select>
            </div>
          </div>

          {/* Due Date & Est Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Est. Hours</label>
              <input
                type="number"
                min={1}
                max={100}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Detailed Instructions & Scope</label>
            <textarea
              rows={3}
              placeholder="Provide context, required outcomes, or links to references..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="Design, Q3-Sprint, Student-Intake"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Save & Dispatch Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
