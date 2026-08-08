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
} from 'lucide-react';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin?: () => void;
  onOpenAICommand?: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({
  isOpen,
  onClose,
  onNavigateToAdmin,
  onOpenAICommand,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to Alpha Spark OS',
      subtitle: 'Powered by AminApps Design System',
      badge: 'Getting Started',
      icon: Sparkles,
      iconColor: 'text-[#E85D04]',
      bgGlow: 'from-[#E85D04]/20 to-[#0099CC]/20',
      description:
        'Alpha Spark OS is your central AI-powered workspace for managing Software Engineering, Teaching, Graphic Design, Finance, HR, and Operations.',
      highlights: [
        'Real-time Firestore data sync across team members',
        'Vibrant AminApps design tokens with Syne & Inter typography',
        'Multi-directorate workflow management',
      ],
    },
    {
      title: 'AI Command Bar (⌘K)',
      subtitle: 'Natural Language Task Control',
      badge: 'AI Assistant',
      icon: Sparkles,
      iconColor: 'text-amber-300',
      bgGlow: 'from-amber-500/20 to-[#E85D04]/20',
      description:
        'Press ⌘K or click "AI Manager" to execute commands, create tasks automatically, filter overdue workstreams, or generate analytics reports.',
      highlights: [
        'Type "Create urgent task for Fatima to review syllabus"',
        'Type "Show overdue tasks in Engineering"',
        'Type "Generate weekly progress report"',
      ],
    },
    {
      title: 'Task Matrix & Directorate Grid',
      subtitle: 'Structured Workflow Operations',
      badge: 'Workstreams',
      icon: Kanban,
      iconColor: 'text-[#0099CC]',
      bgGlow: 'from-[#0099CC]/20 to-[#F4A261]/20',
      description:
        'Switch seamlessly between Kanban board view, List matrix, Calendar schedules, and Directorate progress bars.',
      highlights: [
        'Filter tasks by specific Directorate or Priority',
        'Manage subtasks, attachments, and due dates',
        'Track Directorate health and completion rates',
      ],
    },
    {
      title: 'Super Admin & Real Auth',
      subtitle: 'Full Platform Usage Control',
      badge: 'Platform Admin',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/20 to-[#1A1A2E]',
      description:
        'As a Super Admin, you have full authority to manage user roles, directorate assignments, platform API usage, and system health metrics.',
      highlights: [
        'Firebase Authentication integration for real user profiles',
        'Super Admin Panel for managing team roles & quotas',
        'Firestore security rules & live storage backup',
      ],
    },
  ];

  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-xl bg-[#1A1A2E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient background glow */}
        <div
          className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${step.bgGlow} rounded-full blur-3xl pointer-events-none transition-all duration-500`}
        />

        {/* Header bar */}
        <div className="relative flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/10 text-[#0099CC] border border-white/10">
              {step.badge}
            </span>
            <span className="text-xs text-slate-400 font-bold">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step content */}
        <div className="relative space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon className={`w-6 h-6 ${step.iconColor}`} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-white italic uppercase tracking-tight">
                {step.title}
              </h2>
              <p className="text-xs font-bold text-[#0099CC] tracking-wider uppercase mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {step.description}
          </p>

          {/* Key highlights */}
          <div className="space-y-2 pt-2">
            {step.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                <span className="font-medium">{h}</span>
              </div>
            ))}
          </div>

          {/* Action shortcut triggers on specific steps */}
          {currentStep === 1 && onOpenAICommand && (
            <button
              onClick={() => {
                onClose();
                onOpenAICommand();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-[#E85D04] to-[#F4A261] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-95 transition shadow-lg glow-orange flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Try AI Manager Now (⌘K)
            </button>
          )}

          {currentStep === 3 && onNavigateToAdmin && (
            <button
              onClick={() => {
                onClose();
                onNavigateToAdmin();
              }}
              className="w-full py-2.5 bg-[#0099CC] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#0099CC]/90 transition shadow-md glow-blue flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Open Platform Admin Panel
            </button>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="relative flex items-center justify-between pt-6 mt-6 border-t border-white/10">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-6 bg-[#E85D04]'
                    : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1 border border-white/10"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-[#E85D04] to-[#F4A261] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg glow-orange flex items-center gap-1"
            >
              {currentStep === steps.length - 1 ? (
                'Finish Setup'
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
