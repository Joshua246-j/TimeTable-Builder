import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ValidationStatusCardProps {
  isValid: boolean;
  errors?: string[];
  successMessage?: string;
}

export function ValidationStatusCard({ isValid, errors = [], successMessage = 'All good!\nNo validation errors in current step.' }: ValidationStatusCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h4 className="text-sm font-bold text-slate-800 mb-4">Validation Status</h4>
      
      {isValid ? (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3 flex gap-3">
          <div className="mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#16A34A] leading-tight">{successMessage.split('\n')[0]}</span>
            {successMessage.split('\n')[1] && (
              <span className="text-[11px] font-medium text-[#15803D] mt-0.5 leading-tight">{successMessage.split('\n')[1]}</span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-3 flex gap-3">
          <div className="mt-0.5">
            <AlertCircle className="w-5 h-5 text-[#DC2626]" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[13px] font-bold text-[#DC2626] leading-tight mb-1">Errors found</span>
            <ul className="flex flex-col gap-1">
              {errors.map((err, i) => (
                <li key={i} className="text-[11px] font-medium text-[#B91C1C] leading-tight flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#DC2626] shrink-0 mt-1.5" />
                  {err}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
