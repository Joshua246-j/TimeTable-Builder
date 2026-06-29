import React from 'react';

export interface EvaluationItemProps {
  icon: React.ReactNode;
  title: string;
  count: string | number;
  label: string;
  opacity?: string;
}

export function EvaluationItem({ icon, title, count, label, opacity = "" }: EvaluationItemProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors ${opacity}`}>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50/50 flex items-center justify-center text-[#5A67D8]">
          {icon}
        </div>
        <span className="text-[13px] font-[700] text-slate-800">{title}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[15px] font-[800] text-slate-900 leading-none mb-1">{count}</span>
        <span className="text-[9px] font-[700] text-slate-400 uppercase tracking-widest leading-none">{label}</span>
      </div>
    </div>
  );
}
