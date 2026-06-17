"use client";


import { memo } from "react";
import { cn } from "@/lib/utils";

interface EmptySlotProps {
  isSelected?: boolean;
  onClick?: () => void;
  startTime?: string;
  endTime?: string;
}

export default memo(function EmptySlot({
  isSelected = false,
  onClick,
}: EmptySlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full h-full min-h-[160px] items-center justify-center overflow-hidden rounded-[10px] border border-dashed transition-all duration-200",
        isSelected
          ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-100"
          : "border-slate-300 bg-white hover:-translate-y-[1px] hover:border-blue-500 hover:bg-blue-50/40"
      )}
    >
      <span className={cn(
        "text-[10px] font-bold tracking-wider",
        "text-slate-400 group-hover:text-blue-600"
      )}>
        + ASSIGN
      </span>
    </button>
  );
});