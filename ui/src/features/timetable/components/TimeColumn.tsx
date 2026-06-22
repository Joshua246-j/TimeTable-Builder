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
          min-h-[72px]
          flex-col
          items-center
          justify-center
          px-1
          text-center
          w-[56px]
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
        min-h-[72px]
        flex-col
        justify-center
        items-center
        bg-transparent
        px-1
        w-[56px]
      "
    >
      <span
        className="
          text-[9px]
          font-bold
          text-slate-900
          text-center
        "
      >
        {startTime}
      </span>

      <span
        className="
          mt-[1px]
          text-[9px]
          font-bold
          text-slate-500
          text-center
        "
      >
        {endTime}
      </span>
    </div>
  );
}