"use client";

import { memo, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateTimeAllocation, updatePeriodDurationAndSync } from "@/store/syntheticActions";
import { CircularTimePicker } from "./CircularTimePicker";

interface TimeRailProps {
  cellId?: string;       // allocation id for Redux dispatch
  subjectId?: string;
  dayId?: string;
  startTime?: string;
  endTime?: string;
  onTimeChange?: (startTime: string, endTime: string) => void;
}

export default memo(function TimeRail({
  cellId,
  subjectId,
  dayId,
  startTime = "09:00",
  endTime = "10:00",
  onTimeChange,
}: TimeRailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startTime || "09:00");
  const [localEnd, setLocalEnd] = useState(endTime || "10:00");

  useEffect(() => {
    if (startTime) setLocalStart(startTime);
    if (endTime) setLocalEnd(endTime);
  }, [startTime, endTime]);

  const dispatch = useDispatch<AppDispatch>();

  const handleOpen = (open: boolean) => {
    if (open) {
      // reset local state to current props when opening
      setLocalStart(startTime);
      setLocalEnd(endTime);
    }
    setIsOpen(open);
  };

  const parseTimeStr = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const handleConfirm = () => {
    const startMins = parseTimeStr(localStart);
    const endMins = parseTimeStr(localEnd);

    if (endMins <= startMins) {
      alert("End time must be after start time");
      return;
    }

    // Dispatch to Redux if we have allocation context
    if (cellId && subjectId && dayId) {
      dispatch(
        updateTimeAllocation({
          id: cellId,
          subjectId,
          dayId,
          startTime: localStart,
          endTime: localEnd,
        })
      );
    }

    // Also call prop callback if provided (for local handling)
    if (onTimeChange && (localStart !== startTime || localEnd !== endTime)) {
      onTimeChange(localStart, localEnd);
    }

    setIsOpen(false);
  };

  const formatTimeRailDisplay = (timeStr: string, isStart: boolean, otherTimeStr: string) => {
    // Both times are guaranteed to be "hh:mm A" based on the new logic
    const timeMatch = timeStr.match(/^(\d{2}:\d{2})\s*(AM|PM)?$/i);
    const otherMatch = otherTimeStr.match(/^(\d{2}:\d{2})\s*(AM|PM)?$/i);
    
    if (!timeMatch || !otherMatch) return timeStr;
    
    const timeBase = timeMatch[1];
    const timeAmPm = timeMatch[2]?.toUpperCase();
    
    const otherAmPm = otherMatch[2]?.toUpperCase();
    
    // If it's the start time, and both have the SAME AM/PM, hide AM/PM for the start time
    if (isStart && timeAmPm && otherAmPm && timeAmPm === otherAmPm) {
      return timeBase;
    }
    
    return timeStr;
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="sc-time-panel shrink-0 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col items-center justify-center py-[14px] px-1 relative z-10 rounded-l-[10px] hover:bg-slate-100 transition-colors cursor-pointer outline-none">
          <div className="text-[12px] font-[700] text-[#0D2463] text-center leading-tight tracking-wide">
            {formatTimeRailDisplay(startTime, true, endTime)}
          </div>
          <div className="w-[12px] h-[1.5px] bg-[#0D2463] my-[4px] opacity-60" />
          <div className="text-[12px] font-[700] text-[#0D2463] mb-1 text-center leading-tight tracking-wide">
            {formatTimeRailDisplay(endTime, false, startTime)}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        className="w-auto p-0 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 bg-white z-[100]"
        onClick={(e) => e.stopPropagation()}
      >
        <CircularTimePicker
          startTime={localStart}
          endTime={localEnd}
          onStartChange={setLocalStart}
          onEndChange={setLocalEnd}
          onConfirm={handleConfirm}
          onDurationSync={(mins) => {
            if (mins > 0) {
              dispatch(updatePeriodDurationAndSync({ startTime, durationMinutes: mins }));
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
});