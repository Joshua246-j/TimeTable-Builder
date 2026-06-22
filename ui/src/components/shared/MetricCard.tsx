import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  radial?: {
    percentage: number;
    color?: string; // e.g. '#10B981'
  };
  className?: string;
  headerAction?: React.ReactNode;
}

export function MetricCard({ title, value, subtitle, icon, trend, radial, className = '', headerAction }: MetricCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-[13px] font-bold text-slate-600">{title}</h4>
        {headerAction ? headerAction : (icon && (
          <div className="text-slate-400">
            {icon}
          </div>
        ))}
      </div>
      
      <div className="flex items-end gap-3 mt-auto">
        {radial ? (
          <div className="flex items-center gap-4">
             <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke={radial.color || "#5A67D8"} 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={`${(radial.percentage / 100) * 251.2} 251.2`} 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-sm font-black text-slate-800 leading-none">{radial.percentage}%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-800 leading-none">{value}</span>
              {subtitle && <span className="text-[11px] font-bold text-slate-500 mt-1">{subtitle}</span>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="flex items-end justify-between w-full">
              <span className="text-3xl font-black text-slate-800 leading-none tracking-tight">{value}</span>
              {trend && (
                <div className="flex flex-col items-end">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                    {trend.isPositive ? '+' : ''}{trend.value}
                  </span>
                  {trend.label && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{trend.label}</span>}
                </div>
              )}
            </div>
            {subtitle && <span className="text-xs font-semibold text-slate-500 mt-2">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
