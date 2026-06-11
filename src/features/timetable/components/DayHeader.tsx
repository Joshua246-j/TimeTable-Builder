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
    <div
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        justify-center
        pb-4
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {/* Desktop */}
      <span
        className={`
          hidden
          text-[11px]
          uppercase
          font-[700]
          tracking-[0.04em]
          lg:block
          mb-[8px]
          ${active ? "text-[#4338CA]" : "text-[#64748B]"}
        `}
      >
        {day}
      </span>

      {/* Mobile / Tablet */}
      <span
        className={`
          text-[11px]
          uppercase
          font-[700]
          tracking-[0.04em]
          lg:hidden
          mb-[8px]
          ${active ? "text-[#4338CA]" : "text-[#64748B]"}
        `}
      >
        {shortLabel ?? day}
      </span>
    </div>
  );
}