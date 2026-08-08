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
  currentUser?: UserType;
  onMeetingCreated?: () => void;
  onTaskCreated?: (task: Task) => void;
}

export const MeetingNotesView: React.FC<MeetingNotesViewProps> = ({
  meetingNotes,
  directorates,
  users,
  onTaskCreated,
}) => {
  const defaultNote: MeetingNote = meetingNotes[0] || {
    id: 'mn-1',
    workspaceId: 'ws-alpha-spark',
    title: 'Executive & Academic Strategy Alignment',
    date: new Date().toISOString(),
    directorateId: 'dir-dev',
    attendeeIds: ['usr-snow', 'usr-fatima', 'usr-amina'],
    content: 'Discussed August student cohort intake, software infrastructure overhaul, and marketing budget.',
    actionItems: [
      { title: 'Assign Fatima to teach Machine Learning cohort tomorrow at 4 PM' },
      { title: 'Ask Amina to design webinar flyer by Friday' },
      { title: 'Audit Q2 operational expenditure for finance team' },
    ],
    createdAt: new Date().toISOString(),
  };

  const [selectedNote, setSelectedNote] = useState<MeetingNote>(defaultNote);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<Task[]>([]);

  const handleExtractActionItems = async () => {
    setIsExtracting(true);
    setExtractedTasks([]);

    const tasks: Task[] = [];
    const tasksList = WorkspaceStorageService.getTasks();

    for (const item of selectedNote.actionItems) {
      const itemText = typeof item === 'string' ? item : item.title;
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
        if (onTaskCreated) onTaskCreated(created);
      }
    }

    setIsExtracting(false);
    setExtractedTasks(tasks);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="p-6 space-y-6 animate-in w-full">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-[#1A1A2E] to-[#E85D04]/20 border border-[#E85D04]/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#E85D04]" /> Executive Meeting Notes & Action Extractor
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Record key discussions and click <strong>"Extract AI Tasks"</strong> to automatically convert unstructured meeting action items into actionable tasks with assigned directorates and due dates.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List Sidebar */}
        <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-3xl p-5 space-y-3 backdrop-blur-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
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
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedNote.id === note.id
                    ? 'bg-[#E85D04]/20 border-[#E85D04] text-white shadow-lg'
                    : 'bg-black/40 border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <h4 className="font-bold text-xs line-clamp-1">{note.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <Calendar className="w-3 h-3 text-[#0099CC]" />
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
          <div className="bg-[#1A1A2E]/80 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display text-xl font-black text-white italic uppercase tracking-tight">{selectedNote.title}</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#0099CC]" /> Date: {new Date(selectedNote.date).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={handleExtractActionItems}
                disabled={isExtracting}
                className="px-5 py-2.5 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg glow-orange disabled:opacity-50 uppercase tracking-wider"
              >
                {isExtracting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    AI Extracting Tasks...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" /> Extract AI Tasks
                  </>
                )}
              </button>
            </div>

            {/* Attendees */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Meeting Attendees</h4>
              <div className="flex flex-wrap items-center gap-2">
                {(selectedNote.attendeeIds || []).map((id) => {
                  const usr = users.find((u) => u.id === id);
                  return (
                    <span key={id} className="px-3 py-1 bg-black/40 border border-white/10 text-slate-200 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#0099CC]" />
                      {usr?.displayName || id}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Notes & Content</h4>
              <p className="text-xs text-slate-300 bg-black/40 p-4 border border-white/10 rounded-2xl leading-relaxed">
                {selectedNote.content}
              </p>
            </div>

            {/* Action Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Action Items ({selectedNote.actionItems.length})</h4>
              <div className="space-y-2">
                {selectedNote.actionItems.map((item, idx) => {
                  const text = typeof item === 'string' ? item : item.title;
                  return (
                    <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-2xl flex items-start gap-3 text-xs text-slate-200">
                      <ArrowRight className="w-4 h-4 text-[#E85D04] mt-0.5 flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extracted Tasks Output */}
            {extractedTasks.length > 0 && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-3 animate-in">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Successfully Extracted & Dispatched {extractedTasks.length} Tasks:
                </div>
                <div className="space-y-2">
                  {extractedTasks.map((t) => (
                    <div key={t.id} className="p-3 bg-black/60 border border-emerald-500/30 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-bold text-white">{t.title}</span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-black bg-[#E85D04]/20 text-[#E85D04] rounded border border-[#E85D04]/30">
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
