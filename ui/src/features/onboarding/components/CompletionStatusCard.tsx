import React from 'react';

interface CompletionStatusCardProps {
  completed: number;
  inProgress: number;
  pending: number;
  total: number;
}

export function CompletionStatusCard({ completed, inProgress, pending, total }: CompletionStatusCardProps) {
  const percentage = Math.round((completed / total) * 100) || 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h4 className="text-sm font-bold text-slate-800 mb-5">Completion Status</h4>
      
      <div className="flex items-center gap-6">
        {/* Radial Chart */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="none" />
            
            {/* Pending segment (grey) - theoretically the whole background is pending, but we can draw it */}
            
            {/* In Progress segment (blue) */}
            {(completed + inProgress) > 0 && (
              <circle 
                cx="50" cy="50" r="40" 
                stroke="#5A67D8" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray={`${((completed + inProgress) / total) * 251.2} 251.2`} 
              />
            )}

            {/* Completed segment (green) */}
            {completed > 0 && (
              <circle 
                cx="50" cy="50" r="40" 
                stroke="#10B981" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray={`${(completed / total) * 251.2} 251.2`} 
              />
            )}
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-800 leading-none">{percentage}%</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completed</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-[11px] font-semibold text-slate-600">Completed</span>
            </div>
            <span className="text-[11px] font-bold text-slate-900">{completed}/{total}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5A67D8]" />
              <span className="text-[11px] font-semibold text-slate-600">In Progress</span>
            </div>
            <span className="text-[11px] font-bold text-slate-900">{inProgress}/{total}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="text-[11px] font-semibold text-slate-600">Pending</span>
            </div>
            <span className="text-[11px] font-bold text-slate-900">{pending}/{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
