import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceSummary } from '../types';

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary;
}

export function AttendanceSummaryCard({ summary }: AttendanceSummaryCardProps) {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardHeader className="pb-4 pt-5 px-6">
        <CardTitle className="text-sm font-semibold text-slate-800">Today&apos;s Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-4 gap-3">
          {/* Total */}
          <div className="bg-[#F8FAFC] rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm">
            <Users className="w-5 h-5 text-[#5A67D8] mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total</span>
            <span className="text-2xl font-bold text-slate-800">{summary.total}</span>
          </div>
          
          {/* Present */}
          <div className="bg-[#F0FDF4]/50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-[#DCFCE7] shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Present</span>
            <span className="text-2xl font-bold text-[#16A34A]">{summary.present}</span>
          </div>

          {/* Absent */}
          <div className="bg-[#FEF2F2]/50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-[#FEE2E2] shadow-sm">
            <XCircle className="w-5 h-5 text-[#DC2626] mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Absent</span>
            <span className="text-2xl font-bold text-[#DC2626]">{summary.absent}</span>
          </div>

          {/* Late */}
          <div className="bg-[#FFFBEB]/50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-[#FEF3C7] shadow-sm">
            <Clock className="w-5 h-5 text-[#D97706] mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Late</span>
            <span className="text-2xl font-bold text-[#D97706]">{summary.late}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
