import React from 'react';
import { Search, FileCheck2, MessagesSquare, KanbanSquare } from 'lucide-react';

export const PHASES = [
  {
    id: 1,
    title: 'Phase 1: Discovery',
    shortTitle: '1. Fit Analysis',
    subtitle: 'JD Match & Skill Gap',
    icon: Search
  },
  {
    id: 2,
    title: 'Phase 2: Resume',
    shortTitle: '2. Resume & App',
    subtitle: 'ATS >85% & Anti-AI',
    icon: FileCheck2,
    isCore: true
  },
  {
    id: 3,
    title: 'Phase 3: Interview',
    shortTitle: '3. Interview Prep',
    subtitle: 'STAR Stories & Salary',
    icon: MessagesSquare
  },
  {
    id: 4,
    title: 'Phase 4: Pipeline',
    shortTitle: '4. Job Tracker',
    subtitle: 'Kanban & Follow-ups',
    icon: KanbanSquare
  }
];

export default function PhaseNav({ activePhase, onSelectPhase }) {
  return (
    <div className="bg-white/70 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        {/* Responsive horizontal scrollable tabs on mobile, clean grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-4 gap-2 overflow-x-auto no-scrollbar py-0.5">
          {PHASES.map((phase) => {
            const Icon = phase.icon;
            const isActive = activePhase === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={`flex items-center space-x-2.5 p-2 sm:p-2.5 rounded-xl text-left transition-all flex-shrink-0 sm:flex-shrink border ${
                  isActive
                    ? 'bg-sky-50 border-sky-300 text-sky-950 font-semibold shadow-2xs'
                    : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs truncate font-medium">
                      {phase.shortTitle}
                    </span>
                    {phase.isCore && (
                      <span className="text-[9px] px-1 py-0.2 font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 hidden sm:inline-block">
                        Core
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-400 truncate hidden md:block">
                    {phase.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
