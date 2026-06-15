import React from 'react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: React.ReactNode;
}

export function ActionCard({ title, description, icon, action, isSelected, onClick, className = '', badge }: ActionCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`border rounded-xl p-5 flex items-start gap-4 transition-colors ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm bg-white' : 'bg-white'
      } ${
        isSelected ? 'border-[#5A67D8] ring-1 ring-[#5A67D8]' : 'border-slate-200'
      } ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] shrink-0">
        {icon}
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="text-[13px] font-bold text-slate-800">{title}</h4>
          {badge}
        </div>
        <p className="text-[11px] font-medium text-slate-500 mb-4">{description}</p>
        
        <div className="mt-auto">
          {action}
        </div>
      </div>
    </div>
  );
}
