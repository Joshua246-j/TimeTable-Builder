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
        min-h-[88px]
        w-full
        flex-col
        items-center
        justify-center
        rounded-xl
        border-2
        border-dashed
        transition-all

        ${
          isSelected
            ? `
              border-blue-400
              bg-blue-50
              ring-2
              ring-blue-100
            `
            : `
              border-slate-200
              bg-slate-50/50
              hover:border-blue-300
              hover:bg-blue-50
            `
        }
      `}
    >
      <div
        className={`
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          transition-colors

          ${
            isSelected
              ? "bg-blue-100"
              : "bg-slate-100 group-hover:bg-blue-100"
          }
        `}
      >
        <Plus
          className={`
            h-4
            w-4

            ${
              isSelected
                ? "text-blue-700"
                : "text-slate-400 group-hover:text-blue-600"
            }
          `}
        />
      </div>

      <span
        className={`
          mt-2
          text-xs
          font-medium

          ${
            isSelected
              ? "text-blue-700"
              : "text-slate-500 group-hover:text-blue-600"
          }
        `}
      >
        Empty Slot
      </span>
    </button>
  );
}