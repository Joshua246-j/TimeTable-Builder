"use client";

import { memo, useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface TimeRailProps {
  startTime?: string;
  endTime?: string;
  onTimeChange?: (startTime: string, endTime: string) => void;
}

export default memo(function TimeRail({
  startTime,
  endTime,
  onTimeChange,
}: TimeRailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startInput, setStartInput] = useState(startTime || "09:00");
  const [endInput, setEndInput] = useState(endTime || "10:00");

  useEffect(() => {
    if (isOpen) {
      setStartInput(startTime || "09:00");
      setEndInput(endTime || "10:00");
    }
  }, [isOpen, startTime, endTime]);

  const handleApply = () => {
    if (onTimeChange && (startInput !== startTime || endInput !== endTime)) {
      onTimeChange(startInput, endInput);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="sc-time-panel shrink-0 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col items-center justify-center py-[14px] px-1 relative z-10 rounded-l-[10px] hover:bg-slate-100 transition-colors cursor-pointer outline-none">
          <div className="text-[12px] font-[700] text-[#0D2463] text-center leading-tight tracking-wide">{startTime}</div>
          <div className="w-[12px] h-[1.5px] bg-[#0D2463] my-[4px] opacity-60"></div>
          <div className="text-[12px] font-[700] text-[#0D2463] mb-1 text-center leading-tight tracking-wide">{endTime}</div>
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="w-56 p-3 rounded-xl shadow-lg border border-slate-200 z-50 bg-white font-inter" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-bold text-slate-800">Change Time</h4>
        </div>
        
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Start Time</label>
            <input 
              type="time" 
              value={startInput} 
              onChange={(e) => setStartInput(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">End Time</label>
            <input 
              type="time" 
              value={endInput} 
              onChange={(e) => setEndInput(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1 h-8 text-xs" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
