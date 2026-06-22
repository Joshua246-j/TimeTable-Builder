import { Check, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttendanceStatus } from '../types';

interface AttendanceStatusSelectorProps {
  status: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}

export function AttendanceStatusSelector({ status, onChange }: AttendanceStatusSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange('Present')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
          status === 'Present'
            ? "bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC] shadow-sm"
            : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600"
        )}
      >
        <Check className={cn("w-3.5 h-3.5", status === 'Present' ? "text-[#16A34A]" : "text-slate-400")} />
        Present
      </button>

      <button
        onClick={() => onChange('Absent')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
          status === 'Absent'
            ? "bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] shadow-sm"
            : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600"
        )}
      >
        <X className={cn("w-3.5 h-3.5", status === 'Absent' ? "text-[#DC2626]" : "text-slate-400")} />
        Absent
      </button>

      <button
        onClick={() => onChange('Late')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
          status === 'Late'
            ? "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] shadow-sm"
            : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600"
        )}
      >
        <Clock className={cn("w-3.5 h-3.5", status === 'Late' ? "text-[#D97706]" : "text-slate-400")} />
        Late
      </button>
    </div>
  );
}
