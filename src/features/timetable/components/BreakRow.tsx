"use client";

interface BreakRowProps {
  label: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  onRemove?: () => void;
  isGridEditMode?: boolean;
}

export default function BreakRow({
  label,
  startTime,
  endTime,
  durationMinutes,
  onRemove,
  isGridEditMode
}: BreakRowProps) {
  return (
    <div
      className="
        col-span-full
        border-b
        border-slate-200
        bg-[#F7F8FC]
        relative
        group
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
            ☕ {startTime} — {endTime} • {label} ({durationMinutes}m)
          </p>
        </div>
      </div>
      {isGridEditMode && onRemove && (
        <button
          onClick={onRemove}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-200"
        >
          Remove Break
        </button>
      )}
    </div>
  );
}
