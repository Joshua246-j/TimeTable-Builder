"use client";

interface TimeColumnProps {
  startTime: string;
  endTime: string;
  isLunchBreak?: boolean;
}

export default function TimeColumn({
  startTime,
  endTime,
  isLunchBreak = false,
}: TimeColumnProps) {
  if (isLunchBreak) {
    return (
      <div
        className="
          flex
          min-h-[88px]
          flex-col
          items-center
          justify-center
          border-r
          border-slate-200
          bg-amber-50
          px-3
          text-center
        "
      >
        <span
          className="
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-amber-700
          "
        >
          Lunch
        </span>

        <span
          className="
            mt-1
            text-[11px]
            text-amber-600
          "
        >
          Break
        </span>
      </div>
    );
  }

  return (
    <div
      className="
        flex
        min-h-[88px]
        flex-col
        justify-center
        border-r
        border-slate-200
        bg-white
        px-3
      "
    >
      <span
        className="
          text-sm
          font-semibold
          text-slate-900
        "
      >
        {startTime}
      </span>

      <span
        className="
          mt-1
          text-xs
          text-slate-500
        "
      >
        {endTime}
      </span>
    </div>
  );
}