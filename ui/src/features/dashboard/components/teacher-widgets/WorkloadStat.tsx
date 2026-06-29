import React from 'react';

export interface WorkloadStatProps {
  label: string;
  value: string | number;
  sub: string;
}

export function WorkloadStat({ label, value, sub }: WorkloadStatProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-[800] text-slate-400 uppercase tracking-wider mb-2">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-[28px] font-[800] text-slate-900 leading-none">{value}</span>
        <span className="text-[11px] font-[600] text-slate-400">{sub}</span>
      </div>
    </div>
  );
}
