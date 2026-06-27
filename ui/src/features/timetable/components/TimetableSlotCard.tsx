"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import TimeRail from "./TimeRail";

interface TimetableSlotCardProps {
  children?: React.ReactNode;
  startTime?: string;
  endTime?: string;
  duration?: string;
  isSelected?: boolean;
  isConflict?: boolean;
  isLocked?: boolean;
  isSelectionMode?: boolean;
  isReadOnly?: boolean;
  onClick?: () => void;
  onTimeChange?: (startTime: string, endTime: string) => void;
}

export default memo(function TimetableSlotCard({
  children,
  startTime,
  endTime,
  isSelected = false,
  isConflict = false,
  isLocked = false,
  isSelectionMode = false,
  isReadOnly = false,
  onClick,
  onTimeChange,
}: TimetableSlotCardProps) {
  
  return (
    <>
      <style>{`
        .sc-container {
          container-type: inline-size;
          container-name: slotcard;
        }
        
        .sc-time-panel {
          width: 72px; /* Dense */
          min-width: 72px;
        }
        
        @container slotcard (min-width: 190px) {
          .sc-time-panel { width: 80px; min-width: 80px; } /* Tablet */
        }
        
        @container slotcard (min-width: 250px) {
          .sc-time-panel { width: 68px; min-width: 68px; } /* Desktop */
        }
      `}</style>
      <div
        onClick={onClick}
        className={cn(
          `
          sc-container
          font-inter
          group
          relative
          w-full
          h-full
          min-h-[160px]
          flex
          rounded-[16px]
          overflow-hidden
          transition-all
          duration-200
        `,
          isReadOnly ? "bg-transparent" : "bg-white border border-[#E5E7EB] shadow-sm",
          // Selection logic
          isSelectionMode && "cursor-pointer ring-2 ring-blue-100",
          (!isSelectionMode && onClick && !isReadOnly) && "cursor-pointer hover:-translate-y-[2px]",
          
          // States
          isConflict && "border border-orange-500 bg-orange-50/30",
          isSelected && "ring-2 ring-[#2563EB]/40 shadow-md",
          isLocked && "ring-1 ring-slate-200 opacity-80"
        )}
      >
        {/* Selection Indicator */}
        {isSelectionMode && (
          <div className="absolute top-2 right-2 z-30">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors",
              isSelected 
                ? "bg-[#2563EB] border-[#2563EB] text-white" 
                : "border-slate-300 bg-white/50 text-transparent hover:border-[#2563EB]"
            )}>
              ✓
            </div>
          </div>
        )}

        {/* TimeRail - Only visible in edit mode */}
        {!isReadOnly && (
          <div className="shrink-0 relative z-30">
             <TimeRail startTime={startTime} endTime={endTime} onTimeChange={onTimeChange} />
          </div>
        )}

        {/* Child Content (SubjectClassCard) */}
        <div className="flex-1 relative min-w-0 flex flex-col z-20 bg-transparent">
          {children}
        </div>
      </div>
    </>
  );
});
