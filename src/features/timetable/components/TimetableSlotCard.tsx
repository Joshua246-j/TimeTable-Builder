"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import TimeRail from "./TimeRail";

interface TimetableSlotCardProps {
  children?: React.ReactNode;
  startTime?: string;
  endTime?: string;
  duration?: string;
  rowSpan?: number;
  isSelected?: boolean;
  isConflict?: boolean;
  isLocked?: boolean;
  isSelectionMode?: boolean;
  onClick?: () => void;
}

export default memo(function TimetableSlotCard({
  children,
  startTime,
  endTime,
  duration,
  rowSpan = 1,
  isSelected = false,
  isConflict = false,
  isLocked = false,
  isSelectionMode = false,
  onClick,
}: TimetableSlotCardProps) {
  
  // Calculate height dynamically based on rowSpan
  const baseHeight = 120; // single period height
  const gap = 16; // assuming a gap of 16px between rows in grid
  const height = rowSpan > 1 ? baseHeight * rowSpan + gap * (rowSpan - 1) : baseHeight;

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
          .sc-time-panel { width: 88px; min-width: 88px; } /* Desktop */
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
          flex
          rounded-[10px]
          border
          bg-white
          overflow-hidden
          transition-all
          duration-200
        `,
          // Base style
          "border-[#CBD5E1]",
          
          // Selection logic
          isSelectionMode && "cursor-pointer hover:border-blue-400 hover:ring-2 hover:ring-blue-100",
          (!isSelectionMode && onClick) && "cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)]",
          
          // States
          isConflict && "border-orange-500 border-l-[4px] bg-orange-50/30",
          isSelected && "border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md",
          isLocked && "ring-1 ring-slate-300 bg-slate-50"
        )}
        style={{
          minHeight: `${height}px`,
          gridRow: `span ${rowSpan}`
        }}
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

        {/* TimeRail */}
        <TimeRail startTime={startTime} endTime={endTime} duration={duration} />

        {/* Child Content (SubjectClassCard) */}
        <div className="flex-1 relative min-w-0 bg-transparent flex flex-col z-20">
          {children}
        </div>
      </div>
    </>
  );
});
