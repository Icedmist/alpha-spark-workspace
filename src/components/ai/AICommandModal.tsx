'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Command, Send, CheckCircle2, User, Calendar, Tag, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { AICommandParseResult, Task, Directorate, User as UserType } from '../../types';
import { AICommandParser } from '../../lib/aiCommandParser';
import { WorkspaceStorageService } from '../../lib/storage';
import confetti from 'canvas-confetti';

interface AICommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreatedOrUpdated?: (task: Task) => void;
  onFilterOverdue?: () => void;
  onGenerateReport?: () => void;
}

export const AICommandModal: React.FC<AICommandModalProps> = ({
  isOpen,
  onClose,
  onTaskCreatedOrUpdated,
  onFilterOverdue,
  onGenerateReport,
}) => {
  const [command, setCommand] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parseResult, setParseResult] = useState<AICommandParseResult | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const samplePrompts = [
    'Assign Fatima to teach Machine Learning cohort tomorrow at 4 PM',
    'Ask Amina to design the webinar flyer by Friday',
    'Schedule student orientation for August Intake',
    'Mark the course catalog as completed',
    'Audit monthly Q2 operational expenditure',
    'Generate this week\'s report',
    'Show overdue tasks requiring urgent action',
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleParse = async (inputCmd?: string) => {
    const textToParse = inputCmd || command;
    if (!textToParse.trim()) return;

    setIsAnalyzing(true);
    setExecutionMessage(null);

    const users = WorkspaceStorageService.getUsers();
    const directorates = WorkspaceStorageService.getDirectorates();
    const tasks = WorkspaceStorageService.getTasks();

    const result = await AICommandParser.parseCommandWithAI(textToParse, users, directorates, tasks);
    setParseResult(result);
    setIsAnalyzing(false);
  };

  const handleExecute = () => {
    if (!parseResult) return;

    if (parseResult.intent === 'create_task' && parseResult.extractedTask) {
      const taskData = parseResult.extractedTask;
      const created = WorkspaceStorageService.addTask({
        workspaceId: WorkspaceStorageService.getCurrentWorkspaceId(),
        title: taskData.title || 'New AI Task',
        description: taskData.description || '',
        category: taskData.category || 'custom',
        directorateId: taskData.directorateId || 'dir-dev',
        assigneeIds: taskData.assigneeIds || ['usr-snow'],
        createdBy: 'usr-snow',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        dueDate: taskData.dueDate || new Date().toISOString(),
        estimatedHours: 4,
        attachments: [],
        subtasks: taskData.subtasks || [],
        tags: taskData.tags || ['AI Created'],
      });

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setExecutionMessage(`Task "${created.title}" successfully created and assigned!`);
      if (onTaskCreatedOrUpdated) onTaskCreatedOrUpdated(created);
    } else if (parseResult.intent === 'update_status') {
      const tasks = WorkspaceStorageService.getTasks();
      const target = tasks.find((t) => t.id === parseResult.updatedTaskId) || tasks[0];
      if (target) {
        const updated = WorkspaceStorageService.updateTaskStatus(target.id, parseResult.newStatus || 'completed');
        if (updated && onTaskCreatedOrUpdated) onTaskCreatedOrUpdated(updated);
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        setExecutionMessage(`Task "${target.title}" status updated to ${parseResult.newStatus?.replace('_', ' ')}.`);
      }
    } else if (parseResult.intent === 'filter_overdue') {
      if (onFilterOverdue) onFilterOverdue();
      setExecutionMessage('Applied filter for overdue tasks!');
    } else if (parseResult.intent === 'generate_report') {
      if (onGenerateReport) onGenerateReport();
      setExecutionMessage('Navigating to Performance Analytics Report generator!');
    }

    setTimeout(() => {
      onClose();
      setParseResult(null);
      setCommand('');
      setExecutionMessage(null);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/90">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse text-indigo-400" />
            <span className="font-semibold text-sm tracking-wide text-slate-200">Alpha Spark AI Project Manager</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="p-5 border-b border-slate-800/60 bg-slate-950/40">
          <div className="relative flex items-center">
            <Command className="absolute left-4 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleParse();
              }}
              placeholder="e.g. Assign Fatima to teach Machine Learning cohort tomorrow at 4 PM..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent text-sm transition shadow-inner"
              autoFocus
            />
            <button
              onClick={() => handleParse()}
              disabled={isAnalyzing || !command.trim()}
              className="absolute right-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  AI Parsing...
                </span>
              ) : (
                <>
                  Parse <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {/* Sample Prompts */}
          <div className="mt-3.5 flex flex-wrap gap-2">
            <span className="text-[11px] font-medium text-slate-500 py-1">Try asking:</span>
            {samplePrompts.slice(0, 4).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCommand(prompt);
                  handleParse(prompt);
                }}
                className="text-xs bg-slate-800/70 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-700/60 rounded-lg px-2.5 py-1 transition text-left"
              >
                ✨ {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Execution Output Preview */}
        {parseResult && (
          <div className="p-5 space-y-4 bg-slate-900/60 animate-in fade-in duration-200">
            <div className="flex items-start gap-3 p-3.5 bg-indigo-950/40 border border-indigo-800/40 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">AI Intent Detected</h4>
                <p className="text-sm text-slate-200 mt-0.5">{parseResult.explanation}</p>
              </div>
            </div>

            {/* Extracted Task Preview Card */}
            {parseResult.extractedTask && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/40">
                    {parseResult.extractedTask.category || 'Task'}
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase rounded ${
                    parseResult.extractedTask.priority === 'urgent' ? 'bg-red-900/60 text-red-300 border border-red-700/40' :
                    parseResult.extractedTask.priority === 'high' ? 'bg-amber-900/60 text-amber-300 border border-amber-700/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {parseResult.extractedTask.priority} Priority
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-100">{parseResult.extractedTask.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{parseResult.extractedTask.description}</p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Assignee: <strong className="text-slate-200">{parseResult.extractedTask.assigneeNames?.join(', ') || 'Team Lead'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Due: <strong className="text-slate-200">{new Date(parseResult.extractedTask.dueDate || Date.now()).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message Banner */}
            {executionMessage && (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs font-medium animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{executionMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setParseResult(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
              >
                Clear
              </button>
              <button
                onClick={handleExecute}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm & Execute
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Powered by Google Gemini 2.5 Flash</span>
          <span className="flex items-center gap-1">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[10px]">Esc</kbd> to close
          </span>
        </div>

      </div>
    </div>
  );
};
