"use client";

interface LunchBreakRowProps {
  label?: string;

  startTime?: string;

  endTime?: string;
}

export default function LunchBreakRow({
  label = "Lunch Break",
  startTime,
  endTime,
}: LunchBreakRowProps) {
  return (
    <div
      className="
        col-span-full
        border-b
        border-slate-200
        bg-[#F7F8FC]
      "
    >
      <div
        className="
          flex
          min-h-[72px]
          items-center
          justify-center
          px-4
        "
      >
        <div className="text-center">
          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-widest
              text-slate-500
            "
          >
            ☕ {startTime || "12:00 PM"} — {endTime || "01:00 PM"} • {label}
          </p>
        </div>
      </div>
    </div>
  );
}