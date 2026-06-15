import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface RequiredSection {
  id: string;
  label: string;
  missingCount: number;
  icon?: React.ReactNode;
}

interface RequiredFieldsCardProps {
  sections: RequiredSection[];
}

export function RequiredFieldsCard({ sections }: RequiredFieldsCardProps) {
  const totalMissing = sections.reduce((acc, curr) => acc + curr.missingCount, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-sm font-bold text-slate-800">Required Fields Summary</h4>
        {totalMissing > 0 && (
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
            {totalMissing} Required
          </span>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        {sections.map(section => (
          <div key={section.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-slate-500">
                {section.icon || <AlertCircle className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[11px] font-semibold text-slate-700">{section.label}</span>
            </div>
            {section.missingCount > 0 ? (
              <span className="text-[11px] font-bold text-[#DC2626]">{section.missingCount} missing</span>
            ) : (
              <span className="text-[11px] font-bold text-[#10B981]">Complete</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
