"use client";

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
    <div className="sc-time-panel shrink-0 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col items-center justify-center py-[14px] px-1 relative z-10 rounded-l-[10px]">
      <div className="text-[12px] font-[700] text-[#0D2463] text-center leading-tight tracking-wide">{startTime}</div>
      <div className="w-[12px] h-[1.5px] bg-[#0D2463] my-[4px] opacity-60"></div>
      <div className="text-[12px] font-[700] text-[#0D2463] mb-3 text-center leading-tight tracking-wide">{endTime}</div>
      
      {duration && (
        <div className="flex items-center gap-[4px] text-[#818CF8]">
          <Clock className="w-[14px] h-[14px]" />
          <span className="text-[12px] font-[500]">{duration}</span>
        </div>
      )}
    </div>
  );
});
