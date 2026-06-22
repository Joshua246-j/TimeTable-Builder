import React from 'react';

export interface SummaryItem {
  id: string;
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}

interface SummaryCardProps {
  title: string;
  items: SummaryItem[];
}

export function SummaryCard({ title, items }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h4 className="text-sm font-bold text-slate-800 mb-5">{title}</h4>
      
      <div className="flex flex-col gap-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {item.icon && (
                <div className="text-slate-400">
                  {item.icon}
                </div>
              )}
              <span className="text-[11px] font-semibold text-slate-600">{item.label}</span>
            </div>
            <div className="text-[11px] font-bold text-slate-900 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
