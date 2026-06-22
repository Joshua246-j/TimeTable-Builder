import React from 'react';

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerBox?: boolean;
}

export function FormSection({ title, icon, description, children, className = '', headerBox = false }: FormSectionProps) {
  return (
    <div className={`flex flex-col mb-10 ${className}`}>
      <div className={`flex items-center gap-3 mb-6 ${headerBox ? 'bg-[#F8FAFC] p-4 rounded-xl border border-slate-200' : ''}`}>
        {icon && (
          <div className={`${headerBox ? 'w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5A67D8] flex items-center justify-center shadow-sm' : 'text-[#5A67D8]'}`}>
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          <h3 className={`font-bold text-slate-800 ${headerBox ? 'text-[15px]' : 'text-sm'}`}>{title}</h3>
          {description && <p className="text-[11px] font-medium text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      
      <div className={headerBox ? 'px-4' : ''}>
        {children}
      </div>
    </div>
  );
}
