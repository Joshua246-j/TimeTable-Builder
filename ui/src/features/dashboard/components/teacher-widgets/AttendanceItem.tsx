import React from 'react';

export interface AttendanceItemProps {
  title: string;
  time: string;
  label: string;
  type: 'warning' | 'success' | 'upcoming';
  icon: React.ReactNode;
}

export function AttendanceItem({ title, time, label, type, icon }: AttendanceItemProps) {
  const isWarning = type === 'warning';
  const isSuccess = type === 'success';

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-all group">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isWarning ? 'bg-indigo-50 text-indigo-500' : 
          isSuccess ? 'bg-emerald-50 text-emerald-500' : 
          'bg-slate-50 text-slate-400'
        }`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className={`text-[12px] font-[800] ${isSuccess ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{title}</span>
          <span className="text-[10px] font-[600] text-slate-400 mt-0.5">{time}</span>
        </div>
      </div>
      <span className={`text-[10px] font-[800] ${
        isWarning ? 'text-orange-500' : 
        isSuccess ? 'text-emerald-500' : 
        'text-orange-300'
      }`}>{label}</span>
    </div>
  );
}
