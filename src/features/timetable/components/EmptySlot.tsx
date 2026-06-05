"use client";

import { Plus } from "lucide-react";

interface EmptySlotProps {
  isSelected?: boolean;
  onClick?: () => void;
}

export default function EmptySlot({
  isSelected = false,
  onClick,
}: EmptySlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        flex
        h-full
        min-h-[100px]
        w-full
        flex-col
        items-center
        justify-center
        rounded-xl
        border-2
        border-dashed
        transition-all
        bg-white

        ${
          isSelected
            ? `
              border-[#4F6BFF]
              bg-blue-50/30
              ring-4
              ring-blue-50
            `
            : `
              border-[#E2E8F0]
              hover:border-[#CBD5E1]
              hover:bg-slate-50
            `
        }
      `}
    >
      <div className="flex items-center gap-1.5">
        <Plus className={`h-3 w-3 ${isSelected ? "text-[#4F6BFF]" : "text-[#64748B] group-hover:text-[#475569]"}`} />
        <span
          className={`
            text-[11px]
            font-bold
            uppercase
            tracking-wider
            transition-colors

            ${
              isSelected
                ? "text-[#4F6BFF]"
                : "text-[#64748B] group-hover:text-[#475569]"
            }
          `}
        >
          ASSIGN
        </span>
      </div>
    </button>
  );
}