import React from 'react';

export interface TimetableRowProps {
  time: string;
  endTime: string;
  subject: string;
  code: string;
  room: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  dotColor?: string;
}

export function TimetableRow({ time, endTime, subject, code, room, status, dotColor }: TimetableRowProps) {
  const isOngoing = status === 'ongoing';
  const isCompleted = status === 'completed';

  return (
    <div className="flex items-center gap-6 py-3 relative group z-10">
      <div className="w-[60px] shrink-0 text-right">
        <span className={`block text-[11px] font-[800] ${isOngoing ? 'text-[#5A67D8]' : 'text-slate-600'}`}>{time}</span>
        <span className="block text-[9px] font-[600] text-slate-400 mt-0.5">{endTime}</span>
      </div>
      
      <div className="relative shrink-0 flex items-center justify-center">
        {isOngoing ? (
          <div className="w-3 h-3 rounded-full bg-[#5A67D8] relative z-10 ring-4 ring-indigo-100 flex items-center justify-center">
             <div className="w-1 h-1 rounded-full bg-white"></div>
          </div>
        ) : (
          <div className={`w-2.5 h-2.5 rounded-full ${isCompleted ? 'bg-slate-300' : dotColor || 'bg-[#5A67D8]'} relative z-10`}></div>
        )}
      </div>

      <div className={`flex-1 rounded-xl p-4 flex items-center justify-between ${isOngoing ? 'bg-indigo-50/50 border border-indigo-100 shadow-sm' : 'hover:bg-slate-50 transition-colors border border-transparent'}`}>
        <div className="flex flex-col">
          <span className={`text-[13px] font-[800] ${isCompleted ? 'text-slate-500' : 'text-slate-900'} leading-none mb-1.5`}>{subject}</span>
          <span className="text-[11px] font-[600] text-slate-400 leading-none">{code}</span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[12px] font-[800] ${isCompleted ? 'text-slate-500' : 'text-slate-900'}`}>{room}</span>
          <span className={`text-[9px] font-[800] uppercase tracking-wider ${isCompleted ? 'text-emerald-500' : isOngoing ? 'text-[#5A67D8]' : 'text-slate-400'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
