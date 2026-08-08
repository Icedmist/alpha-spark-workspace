'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Tag } from 'lucide-react';
import { Task, Directorate } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
  directorates: Directorate[];
  onTaskClick: (task: Task) => void;
  onCreateTaskClick: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  directorates,
  onTaskClick,
  onCreateTaskClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDirectorateInfo = (dirId: string) => {
    return directorates.find((d) => d.id === dirId) || { color: '#64748B', code: 'GEN' };
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-indigo-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">Cross-Directorate Schedule & Due Dates</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onCreateTaskClick}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Schedule Task
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 py-2 border-b border-slate-800 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Month Grid Cells */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {/* Empty padding cells for previous month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-28 bg-slate-950/20 rounded-xl border border-slate-900/40"></div>
          ))}

          {/* Actual Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = new Date(year, month, dayNum).toISOString().split('T')[0];

            // Tasks due on this day
            const dayTasks = tasks.filter((t) => {
              const taskDate = new Date(t.dueDate).toISOString().split('T')[0];
              return taskDate === dateStr;
            });

            const isToday =
              new Date().getDate() === dayNum &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            return (
              <div
                key={`day-${dayNum}`}
                className={`h-32 p-2 bg-slate-950/60 border ${
                  isToday ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800/80'
                } rounded-xl flex flex-col justify-between overflow-hidden hover:border-slate-700 transition`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-500">
                      {dayTasks.length} tasks
                    </span>
                  )}
                </div>

                {/* Task pills inside cell */}
                <div className="flex-1 overflow-y-auto space-y-1 my-1 pr-0.5">
                  {dayTasks.map((task) => {
                    const dir = getDirectorateInfo(task.directorateId);
                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="px-2 py-1 rounded text-[11px] font-medium text-white truncate cursor-pointer hover:opacity-90 transition shadow-sm"
                        style={{ backgroundColor: dir.color }}
                        title={`${task.title} (${task.status})`}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
