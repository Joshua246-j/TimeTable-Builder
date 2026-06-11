"use client";


import { memo } from "react";
import { cn } from "@/lib/utils";

interface EmptySlotProps {
  isSelected?: boolean;
  onClick?: () => void;
  startTime?: string;
  endTime?: string;
  rowSpan?: number;
}

export default memo(function EmptySlot({
  isSelected = false,
  onClick,
  rowSpan = 1,
}: EmptySlotProps) {
  const baseHeight = 120;
  const gap = 16;
  const height = rowSpan > 1 ? baseHeight * rowSpan + gap * (rowSpan - 1) : baseHeight;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ minHeight: `${height}px` }}
      className={cn(
        "group relative flex w-full items-center justify-center overflow-hidden rounded-[10px] border border-dashed transition-all duration-200",
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