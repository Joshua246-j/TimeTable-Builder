"use client";

import { memo, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateTimeAllocation, updatePeriodDurationAndSync } from "@/store/syntheticActions";
import { CircularTimePicker } from "./CircularTimePicker";
import { parseTime, isValidDuration } from "@/lib/timeEngine";
import { toast } from "sonner";

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

  const gridConfig = useSelector((state: RootState) => state.gridConfig);

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

  const handleConfirm = () => {
    const startMins = parseTime(localStart);
    const endMins = parseTime(localEnd);

    if (endMins <= startMins) {
      toast.error("End time must be after start time");
      return;
    }

    const duration = endMins - startMins;
    if (!isValidDuration(duration, gridConfig.defaultPeriodDuration)) {
      toast.error(`Selected duration (${duration} minutes) exceeds the configured timetable period (${gridConfig.defaultPeriodDuration} minutes). Update the Grid Configuration to support longer periods or choose a valid duration.`);
      setLocalStart(startTime);
      setLocalEnd(endTime);
      setIsOpen(false);
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

  const computeDuration = (start: string, end: string) => {
    const sMins = parseTime(start);
    const eMins = parseTime(end);
    if(isNaN(sMins) || isNaN(eMins)) return "1h 00m";
    const diff = eMins - sMins;
    if(diff <= 0) return "1h 00m";
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm' : ''}`.trim() || '1h 00m';
  };

  const durationStr = computeDuration(startTime, endTime);

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="sc-time-panel shrink-0 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col items-center justify-center py-2 px-1 relative z-10 rounded-l-[16px] hover:bg-slate-100 transition-colors cursor-pointer outline-none h-full">
          <div className="flex-1 flex flex-col items-center justify-center w-full mt-1.5">
            <div className="text-[11px] font-[800] text-[#0D2463] text-center leading-tight tracking-wide whitespace-nowrap">
              {formatTimeRailDisplay(startTime, true, endTime)}
            </div>
            <div className="w-[10px] h-[1.5px] bg-[#0D2463] my-[6px] opacity-60" />
            <div className="text-[11px] font-[800] text-[#0D2463] text-center leading-tight tracking-wide whitespace-nowrap">
              {formatTimeRailDisplay(endTime, false, startTime)}
            </div>
          </div>
          <div className="mt-auto pt-2 flex items-center justify-center gap-1 text-[#4F46E5] opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="text-[10px] font-[600] tracking-wide">{durationStr}</span>
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