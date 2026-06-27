"use client";


import { memo } from "react";
import { cn } from "@/lib/utils";

interface EmptySlotProps {
  isSelected?: boolean;
  onClick?: () => void;
  startTime?: string;
  endTime?: string;
  isReadOnly?: boolean;
}

export default memo(function EmptySlot({
  isSelected = false,
  onClick,
  isReadOnly = false,
}: EmptySlotProps) {
  if (isReadOnly) {
    return (
      <div className="flex w-full h-full min-h-[160px] rounded-[16px] border border-dashed border-slate-100 bg-transparent" />
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full h-full min-h-[160px] items-center justify-center overflow-hidden rounded-[16px] border border-dashed transition-all duration-200",
        isSelected
          ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-100"
          : "border-slate-200 bg-transparent hover:border-blue-400 hover:bg-blue-50/40"
      )}
    >
      <span className={cn(
        "text-[12px] font-semibold text-slate-300 transition-colors duration-200",
        "group-hover:text-blue-500"
      )}>
        + Assign
      </span>
    </button>
  );
});