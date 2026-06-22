import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  addon?: React.ReactNode;
  helpText?: string;
}

export function FormField({ label, required, error, children, className = '', addon, helpText }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-700 tracking-wide">
          {label} {required && <span className="text-[#DC2626]">*</span>}
        </label>
        {addon}
      </div>
      {children}
      {error && <span className="text-[10px] font-semibold text-[#DC2626] mt-0.5">{error}</span>}
      {helpText && !error && <span className="text-[10px] font-medium text-slate-400 mt-0.5">{helpText}</span>}
    </div>
  );
}
