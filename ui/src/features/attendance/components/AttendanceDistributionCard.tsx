import { InfoCard } from '@/components/shared';

export function AttendanceDistributionCard() {
  return (
    <InfoCard title="Attendance distribution" className="mb-6">
      <div className="flex items-center">
        {/* Chart Placeholder */}
        <div className="w-24 h-24 rounded-full border-[12px] border-[#EEF2FF] border-t-[#5A67D8] border-r-[#5A67D8] border-b-[#DC2626] border-l-[#D97706] opacity-30 mx-auto"></div>
        
        {/* Legend */}
        <div className="flex-1 ml-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5A67D8]"></div>
              <span className="text-[11px] font-semibold text-slate-500">Present (54)</span>
            </div>
            <span className="text-[11px] font-bold text-slate-800">87.1%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></div>
              <span className="text-[11px] font-semibold text-slate-500">Absent (5)</span>
            </div>
            <span className="text-[11px] font-bold text-slate-800">8.1%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></div>
              <span className="text-[11px] font-semibold text-slate-500">Late (3)</span>
            </div>
            <span className="text-[11px] font-bold text-slate-800">4.8%</span>
          </div>
        </div>
      </div>
    </InfoCard>
  );
}
