import React from 'react';

export interface InfoItem {
  id: string;
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  valueClassName?: string;
}

interface InfoCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  items?: InfoItem[];
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export function InfoCard({ title, subtitle, icon, items, children, headerAction, className = '' }: InfoCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm ${className}`}>
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] shrink-0">
              {icon}
            </div>
          )}
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
            {subtitle && <span className="text-[11px] font-medium text-slate-500 mt-0.5">{subtitle}</span>}
          </div>
        </div>
        {headerAction}
      </div>
      
      {items && items.length > 0 && (
        <div className="flex flex-col gap-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {item.icon && (
                  <div className="text-slate-400 shrink-0">
                    {item.icon}
                  </div>
                )}
                <span className="text-[11px] font-semibold text-slate-600 leading-tight">{item.label}</span>
              </div>
              <div className={`text-[11px] font-bold text-slate-900 text-right ${item.valueClassName || ''}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {children && (
        <div className={items && items.length > 0 ? "mt-4" : ""}>
          {children}
        </div>
      )}
    </div>
  );
}
