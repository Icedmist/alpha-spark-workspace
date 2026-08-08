'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, Plus, Calendar, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { MeetingNote, Task, Directorate, User as UserType } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';
import { AICommandParser } from '../../lib/aiCommandParser';
import confetti from 'canvas-confetti';

interface MeetingNotesViewProps {
  meetingNotes: MeetingNote[];
  directorates: Directorate[];
  users: UserType[];
  onTaskCreated: (task: Task) => void;
}

export const MeetingNotesView: React.FC<MeetingNotesViewProps> = ({
  meetingNotes,
  directorates,
  users,
  onTaskCreated,
}) => {
  const [selectedNote, setSelectedNote] = useState<MeetingNote>(meetingNotes[0] || {
    id: 'mn-1',
    workspaceId: 'ws-alpha-1',
    title: 'Executive & Academic Strategy Alignment',
    date: new Date().toISOString(),
    attendees: ['usr-snow', 'usr-fatima', 'usr-amina'],
    summary: 'Discussed August student cohort intake, software infrastructure overhaul, and marketing budget.',
    actionItems: [
      'Assign Fatima to teach Machine Learning cohort tomorrow at 4 PM',
      'Ask Amina to design webinar flyer by Friday',
      'Audit Q2 operational expenditure for finance team',
    ],
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<Task[]>([]);

  const handleExtractActionItems = async () => {
    setIsExtracting(true);
    setExtractedTasks([]);

    const tasks: Task[] = [];
    const tasksList = WorkspaceStorageService.getTasks();

    for (const itemText of selectedNote.actionItems) {
      const parsed = await AICommandParser.parseCommandWithAI(itemText, users, directorates, tasksList);
      if (parsed.intent === 'create_task' && parsed.extractedTask) {
        const taskData = parsed.extractedTask;
        const created = WorkspaceStorageService.addTask({
          workspaceId: WorkspaceStorageService.getCurrentWorkspaceId(),
          title: taskData.title || itemText,
          description: `Extracted from Meeting Note: "${selectedNote.title}". Original item: "${itemText}"`,
          category: taskData.category || 'custom',
          directorateId: taskData.directorateId || 'dir-dev',
          assigneeIds: taskData.assigneeIds || ['usr-snow'],
          createdBy: 'usr-snow',
          priority: taskData.priority || 'medium',
          status: 'todo',
          dueDate: taskData.dueDate || new Date(Date.now() + 86400000).toISOString(),
          estimatedHours: 4,
          attachments: [],
          subtasks: taskData.subtasks || [],
          tags: ['Meeting Extracted', 'AI Created'],
        });
        tasks.push(created);
        onTaskCreated(created);
      }
    }

    setIsExtracting(false);
    setExtractedTasks(tasks);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" /> Executive Meeting Notes & Action Extractor
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Record key discussions and click <strong>"Extract AI Tasks"</strong> to automatically convert unstructured meeting action items into actionable tasks with assigned directorates, due dates, and priority tags.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List Sidebar */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
            Recent Meetings ({meetingNotes.length})
          </h3>
          <div className="space-y-2">
            {meetingNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setExtractedTasks([]);
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  selectedNote.id === note.id
                    ? 'bg-indigo-950/60 border-indigo-500 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <h4 className="font-semibold text-sm line-clamp-1">{note.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>{new Date(note.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{note.actionItems.length} action items</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note Detail & AI Extractor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{selectedNote.title}</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date: {new Date(selectedNote.date).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={handleExtractActionItems}
                disabled={isExtracting}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/25 disabled:opacity-50"
              >
                {isExtracting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    AI Extracting Tasks...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> Extract AI Tasks from Notes
                  </>
                )}
              </button>
            </div>

            {/* Attendees */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">Meeting Attendees</h4>
              <div className="flex flex-wrap items-center gap-2">
                {selectedNote.attendees.map((id) => {
                  const user = users.find((u) => u.id === id);
                  return (
                    <span key={id} className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      {user?.displayName || id}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400">Executive Summary</h4>
              <p className="text-sm text-slate-300 bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl leading-relaxed">
                {selectedNote.summary}
              </p>
            </div>

            {/* Action Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase text-slate-400">Action Items ({selectedNote.actionItems.length})</h4>
              <div className="space-y-2">
                {selectedNote.actionItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-start gap-3 text-xs text-slate-200">
                    <ArrowRight className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Tasks Output */}
            {extractedTasks.length > 0 && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Successfully Extracted & Dispatched {extractedTasks.length} Tasks:
                </div>
                <div className="space-y-2">
                  {extractedTasks.map((t) => (
                    <div key={t.id} className="p-3 bg-slate-950 border border-emerald-800/60 rounded-lg text-xs flex items-center justify-between">
                      <span className="font-semibold text-slate-100">{t.title}</span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-indigo-950 text-indigo-300 rounded">
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
