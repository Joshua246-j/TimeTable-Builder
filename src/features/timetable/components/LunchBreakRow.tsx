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
        bg-amber-50
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
              text-sm
              font-semibold
              text-amber-700
            "
          >
            {label}
          </p>

          {(startTime || endTime) && (
            <p
              className="
                mt-1
                text-xs
                text-amber-600
              "
            >
              {startTime} {startTime && endTime && "—"}{" "}
              {endTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}