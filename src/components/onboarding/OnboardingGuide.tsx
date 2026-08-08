'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Kanban,
  Building2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  HelpCircle,
  Terminal,
  AtSign,
  UserPlus,
  Layers,
  RotateCcw,
  BookOpen,
  Calendar,
  ListFilter,
  Search,
  MessageSquare,
  AlertTriangle,
  Play,
  Key,
} from 'lucide-react';
import { WorkspaceStorageService } from '../../lib/storage';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin?: () => void;
  onOpenAICommand?: () => void;
  initialTab?: string;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({
  isOpen,
  onClose,
  onNavigateToAdmin,
  onOpenAICommand,
  initialTab = 'quickstart',
}) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'tasks' | 'ai' | 'collaboration' | 'directorates' | 'admin'>(
    (initialTab as any) || 'quickstart'
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Overview Quickstart steps
  const quickstartSteps = [
    {
      title: 'Welcome to Alpha Spark OS',
      subtitle: 'Production Real-Data Workspace',
      badge: 'Overview',
      icon: Layers,
      iconColor: 'text-[#E85D04]',
      bgGlow: 'from-[#E85D04]/20 to-[#0099CC]/20',
      description:
        'Alpha Spark OS is your central operating platform for coordinating tasks across Software Engineering, Teaching, Graphic Design, Finance, HR, and Operations.',
      highlights: [
        'Real-time workspace state persistence with Firestore cloud sync',
        'Modern, dark-glass visual design powered by Noto Sans typography',
        'Multi-directorate organization with distinct team leads and colors',
      ],
    },
    {
      title: 'Directorates & Team Structure',
      subtitle: 'Segmented Departmental Workstreams',
      badge: 'Workstreams',
      icon: Building2,
      iconColor: 'text-[#0099CC]',
      bgGlow: 'from-[#0099CC]/20 to-[#F4A261]/20',
      description:
        'Work is organized into dedicated Directorates (DEV, EDU, DSG, MKT, PRT, FIN, HR, OPS, EXEC). Each Directorate has assigned leads, team members, and target metrics.',
      highlights: [
        'Filter tasks by specific Directorate or priority level',
        'Monitor Directorate completion rates in Analytics',
        'Assign lead oversight to ensure accountability',
      ],
    },
    {
      title: 'AI Command Engine (⌘K)',
      subtitle: 'Natural Language Task Processing',
      badge: 'AI Powered',
      icon: Terminal,
      iconColor: 'text-amber-300',
      bgGlow: 'from-amber-500/20 to-[#E85D04]/20',
      description:
        'Press ⌘K anytime to open the Command Palette. Powered by Google Gemini 1.5 Flash, you can create tasks or filter views using plain language.',
      highlights: [
        'Example: "Create high priority task for Fatima to review syllabus"',
        'Example: "Show overdue tasks in Engineering"',
        'Example: "Generate weekly progress report"',
      ],
    },
    {
      title: 'Task Matrix, Comments & @Mentions',
      subtitle: 'Interactive Collaboration & Mobile Touch',
      badge: 'Collaboration',
      icon: AtSign,
      iconColor: 'text-[#F4A261]',
      bgGlow: 'from-[#F4A261]/20 to-[#0099CC]/20',
      description:
        'Manage work on Kanban boards, List views, or Calendar schedules. Use live comment threads with @mentions to notify team members instantly.',
      highlights: [
        'Type @ in comment threads to tag colleagues (@Fatima, @Amina)',
        'One-tap chevron buttons for rapid mobile status transitions',
        'Automated overdue alerts and visual warning badges',
      ],
    },
    {
      title: 'Super Admin Security & Real Auth',
      subtitle: 'Platform User Provisioning & Audit Stream',
      badge: 'Super Admin',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/20 to-[#1A1A2E]',
      description:
        'Restricted to Super Admin credentials (talk2icedmist@gmail.com). Provision new user accounts, assign directorate roles, view security audit streams, and reset database storage.',
      highlights: [
        'Only Super Admins can provision new users and alter access roles',
        'Immutable Security Audit Stream logs all administrative actions',
        'Clean & Reset Database button flushes storage to clean real data',
      ],
    },
  ];

  const currentQuickstart = quickstartSteps[currentStep];
  const StepIcon = currentQuickstart.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1A1A2E] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header bar with tabs & close button */}
        <div className="relative p-5 border-b border-white/10 bg-black/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E85D04]/20 border border-[#E85D04]/40 flex items-center justify-center text-[#E85D04]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                Alpha Spark OS Documentation & Guides
              </h2>
              <p className="text-xs text-slate-400">
                Interactive step-by-step user guides & operational manuals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Category Tabs */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-black/20 border-b border-white/5 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quickstart'
                ? 'bg-[#E85D04] text-white shadow-md glow-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Quickstart Walkthrough
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-[#E85D04] text-white shadow-md glow-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-amber-400" /> Task Management
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ai'
                ? 'bg-[#E85D04] text-white shadow-md glow-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#0099CC]" /> AI Commands (⌘K)
          </button>

          <button
            onClick={() => setActiveTab('collaboration')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'collaboration'
                ? 'bg-[#E85D04] text-white shadow-md glow-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <AtSign className="w-3.5 h-3.5 text-[#F4A261]" /> @Mentions & Chat
          </button>

          <button
            onClick={() => setActiveTab('directorates')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'directorates'
                ? 'bg-[#E85D04] text-white shadow-md glow-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Directorates
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'admin'
                ? 'bg-[#E85D04] text-white shadow-md glow-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Super Admin & DB
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: QUICKSTART WALKTHROUGH */}
          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-lg flex-shrink-0">
                  <StepIcon className={`w-6 h-6 ${currentQuickstart.iconColor}`} />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/10 text-[#0099CC] border border-white/10">
                    {currentQuickstart.badge} · Step {currentStep + 1} of {quickstartSteps.length}
                  </span>
                  <h3 className="font-display text-2xl font-black text-white italic uppercase tracking-tight mt-1">
                    {currentQuickstart.title}
                  </h3>
                  <p className="text-xs font-bold text-[#0099CC] tracking-wider uppercase mt-0.5">
                    {currentQuickstart.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuickstart.description}
              </p>

              <div className="space-y-2">
                {currentQuickstart.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                    <span className="font-medium">{h}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex gap-1.5">
                  {quickstartSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentStep ? 'w-6 bg-[#E85D04]' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition border border-white/10"
                    >
                      Back
                    </button>
                  )}
                  {currentStep < quickstartSteps.length - 1 ? (
                    <button
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="px-4 py-1.5 bg-[#E85D04] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#E85D04]/90 transition"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="px-4 py-1.5 bg-[#0099CC] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#0099CC]/90 transition"
                    >
                      Explore Full How-To Guides →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW TO USE - TASK MANAGEMENT */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-[#E85D04]/10 border border-amber-500/30">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display uppercase italic">
                  <Kanban className="w-5 h-5 text-amber-400" /> Guide: Managing Tasks & Matrix Views
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Learn how to create tasks, toggle matrix views (Kanban, List, Calendar), manage priorities, and use one-tap mobile status advance buttons.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="w-5 h-5 rounded-full bg-[#E85D04] text-white text-[10px] flex items-center justify-center font-mono">1</span>
                    Creating a New Task
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Click <span className="text-[#E85D04] font-bold">+ New Task</span> in the top header or press <kbd className="px-1.5 py-0.5 bg-white/10 text-[10px] rounded font-mono">N</kbd> anywhere on your keyboard. Fill in title, description, assigned Directorate, priority level, and due date.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="w-5 h-5 rounded-full bg-[#E85D04] text-white text-[10px] flex items-center justify-center font-mono">2</span>
                    Switching Matrix Views
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Navigate between <span className="text-[#0099CC] font-bold">Kanban</span> (status columns), <span className="text-[#0099CC] font-bold font-mono">/tasks</span> (List view), and <span className="text-[#0099CC] font-bold">Calendar</span> from the sidebar to visualize deadlines and status progression.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="w-5 h-5 rounded-full bg-[#E85D04] text-white text-[10px] flex items-center justify-center font-mono">3</span>
                    One-Tap Mobile Touch Chevrons
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    On touch devices, tap the chevron icon on any task card to instantly advance its workflow status (<span className="text-[#F4A261] font-mono">To Do → In Progress → Review → Completed</span>).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="w-5 h-5 rounded-full bg-[#E85D04] text-white text-[10px] flex items-center justify-center font-mono">4</span>
                    Overdue Task Visual Warnings
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tasks past their <span className="text-red-400 font-bold">due date</span> automatically show a pulsing warning icon and trigger header notification badges for the Directorate lead.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOW TO USE - AI COMMAND ENGINE */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0099CC]/10 to-[#E85D04]/10 border border-[#0099CC]/30">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display uppercase italic">
                  <Terminal className="w-5 h-5 text-[#0099CC]" /> Guide: AI Natural Language Command Palette (⌘K)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Issue direct natural language requests to Gemini 1.5 Flash to create tasks, filter overdue workstreams, or generate reports.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Keyboard Shortcut</span>
                    <kbd className="px-2 py-1 bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/40 rounded font-mono text-xs">
                      ⌘K or Ctrl+K
                    </kbd>
                  </div>
                  <p className="text-xs text-slate-300">
                    Pressing <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono text-[10px]">⌘K</kbd> anywhere opens the AI Command Bar instantly. You can also click the <span className="text-[#E85D04] font-bold">Commands</span> button in the top header.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Tested Command Examples:
                  </h4>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-amber-200 flex items-center justify-between">
                    <span>"Create high priority task for Fatima to inspect release build"</span>
                    <span className="text-[10px] text-slate-400 font-sans">Task Creation</span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-[#0099CC] flex items-center justify-between">
                    <span>"Show overdue tasks in Software Engineering"</span>
                    <span className="text-[10px] text-slate-400 font-sans">Filter View</span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-emerald-300 flex items-center justify-between">
                    <span>"Generate weekly progress report for executive board"</span>
                    <span className="text-[10px] text-slate-400 font-sans">Analytics Report</span>
                  </div>
                </div>

                {onOpenAICommand && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAICommand();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#0099CC] to-[#E85D04] text-white text-xs font-bold uppercase tracking-wider rounded-2xl hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Terminal className="w-4 h-4 text-white" />
                    Launch AI Command Bar Now (⌘K)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HOW TO USE - COLLABORATION & MENTIONS */}
          {activeTab === 'collaboration' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F4A261]/10 to-purple-500/10 border border-[#F4A261]/30">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display uppercase italic">
                  <AtSign className="w-5 h-5 text-[#F4A261]" /> Guide: Live Task Comments & @Mentions
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Collaborate in real-time inside task detail sheets with instant `@member` notifications.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <MessageSquare className="w-4 h-4 text-[#F4A261]" /> Step 1: Open Task Detail
                  </div>
                  <p className="text-xs text-slate-300">
                    Click any task card on your board or list to open the <span className="text-[#0099CC] font-bold">Task Detail Sheet</span>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <AtSign className="w-4 h-4 text-[#E85D04]" /> Step 2: Type @ to Tag Team Members
                  </div>
                  <p className="text-xs text-slate-300">
                    In the comment box, type <span className="text-[#E85D04] font-bold font-mono">@</span> to open the active member autocomplete list. Select colleagues such as <span className="text-white font-bold">@Fatima</span> or <span className="text-white font-bold">@Amina</span>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Step 3: Instant Notifications
                  </div>
                  <p className="text-xs text-slate-300">
                    Tagged team members receive immediate workspace alerts and audit logs tracking the conversation thread.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HOW TO USE - DIRECTORATES */}
          {activeTab === 'directorates' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-[#0099CC]/10 border border-emerald-500/30">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display uppercase italic">
                  <Building2 className="w-5 h-5 text-emerald-400" /> Guide: Directorate Organization & Workstreams
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Understand how workstream codes, leads, and departmental filters keep team tasks structured.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <div className="font-bold text-[#E85D04] uppercase tracking-wider mb-0.5">DEV · Software Engineering</div>
                  <p className="text-slate-300 text-[11px]">System architecture, release builds, and infrastructure.</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <div className="font-bold text-[#0099CC] uppercase tracking-wider mb-0.5">EDU · Teaching & Curriculum</div>
                  <p className="text-slate-300 text-[11px]">Syllabus design, student grading, and online courses.</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <div className="font-bold text-[#F4A261] uppercase tracking-wider mb-0.5">DSG · Graphic & UI Design</div>
                  <p className="text-slate-300 text-[11px]">Brand assets, UI components, and visual identity.</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <div className="font-bold text-purple-400 uppercase tracking-wider mb-0.5">EXEC · Executive Strategy</div>
                  <p className="text-slate-300 text-[11px]">Quarterly goals, governance, and institutional oversight.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HOW TO USE - SUPER ADMIN & DB RESET */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-purple-500/30">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display uppercase italic">
                  <ShieldCheck className="w-5 h-5 text-purple-400" /> Guide: Super Admin Rights & Clean DB Reset
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Privileges for <span className="text-[#0099CC] font-mono font-bold">talk2icedmist@gmail.com</span> to provision users, manage permissions, view security audit streams, and clean storage.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <UserPlus className="w-4 h-4 text-[#E85D04]" /> User Provisioning & Roles
                  </div>
                  <p className="text-xs text-slate-300">
                    Navigate to <span className="text-[#0099CC] font-mono font-bold">/admin</span> to grant <span className="text-[#E85D04] font-bold">Super Admin</span> or <span className="text-[#0099CC] font-bold">Directorate Lead</span> roles, or provision new user profiles.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security Audit Stream
                  </div>
                  <p className="text-xs text-slate-300">
                    All user creations, role promotions, and task deletions are automatically recorded in an immutable audit stream for operational transparency.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <RotateCcw className="w-4 h-4 text-[#0099CC]" /> Clean Database Reset Button
                  </div>
                  <p className="text-xs text-slate-300">
                    Clicking <span className="text-[#0099CC] font-bold">Clean DB</span> flushes local cache and re-seeds clean, production-ready real data for all directorates.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Reset workspace database to clean production real data?')) {
                        WorkspaceStorageService.clearAndResetDatabase();
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 bg-black/60 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold uppercase rounded-xl transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-[#0099CC]" /> Reset Database Now
                  </button>
                </div>

                {onNavigateToAdmin && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToAdmin();
                    }}
                    className="w-full py-3 bg-[#0099CC] text-white text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-[#0099CC]/90 transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Key className="w-4 h-4 text-emerald-300" /> Go To Super Admin Panel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400">
            Need help? Click the <HelpCircle className="w-3.5 h-3.5 inline text-[#0099CC] mx-1" /> icon in the header anytime to reopen this guide on request.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
