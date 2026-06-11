import { memo } from "react";
import { Clock } from "lucide-react";

interface TimeRailProps {
  startTime?: string;
  endTime?: string;
  duration?: string;
}

export default memo(function TimeRail({
  startTime,
  endTime,
  duration,
}: TimeRailProps) {
  return (
    <div className="sc-time-panel shrink-0 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col items-center justify-center py-2 px-1 relative z-10">
      <div className="text-[12px] font-[700] text-[#0D2463] text-center leading-tight">
        {startTime}
      </div>
      <div className="text-[#0D2463] font-bold my-[4px] text-[11px] leading-none">
        —
      </div>
      <div className="text-[12px] font-[700] text-[#0D2463] mb-2 text-center leading-tight">
        {endTime}
      </div>

      {duration && (
        <div className="flex items-center gap-[4px] text-[#0D2463]/80">
          <Clock className="w-3 h-3" />
          <span className="text-[11px] font-[500]">{duration}</span>
        </div>
      )}
    </div>
  );
});
