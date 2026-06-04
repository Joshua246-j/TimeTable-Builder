"use client";

interface DayHeaderProps {
  day: string;
  shortLabel?: string;
  active?: boolean;
  onClick?: () => void;
}

export default function DayHeader({
  day,
  shortLabel,
  active = false,
  onClick,
}: DayHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-h-[64px]
        w-full
        flex-col
        items-center
        justify-center
        border-b
        border-slate-200
        px-4
        text-center
        transition-all

        ${
          active
            ? `
              bg-blue-50
              text-blue-700
            `
            : `
              bg-white
              text-slate-700
              hover:bg-slate-50
            `
        }
      `}
    >
      {/* Desktop */}
      <span
        className="
          hidden
          text-sm
          font-semibold
          lg:block
        "
      >
        {day}
      </span>

      {/* Mobile / Tablet */}
      <span
        className="
          text-sm
          font-semibold
          lg:hidden
        "
      >
        {shortLabel ?? day}
      </span>
    </button>
  );
}