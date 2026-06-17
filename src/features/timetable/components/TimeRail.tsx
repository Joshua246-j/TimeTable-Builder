"use client";

import { memo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateTimeAllocation } from "@/store/syntheticActions";
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
  const [localStart, setLocalStart] = useState(startTime);
  const [localEnd, setLocalEnd] = useState(endTime);
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

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="sc-time-panel shrink-0 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col items-center justify-center py-[14px] px-1 relative z-10 rounded-l-[10px] hover:bg-slate-100 transition-colors cursor-pointer outline-none">
          <div className="text-[12px] font-[700] text-[#0D2463] text-center leading-tight tracking-wide">
            {startTime}
          </div>
          <div className="w-[12px] h-[1.5px] bg-[#0D2463] my-[4px] opacity-60" />
          <div className="text-[12px] font-[700] text-[#0D2463] mb-1 text-center leading-tight tracking-wide">
            {endTime}
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
        />
      </PopoverContent>
    </Popover>
  );
});