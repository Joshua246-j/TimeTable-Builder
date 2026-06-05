"use client";

import { Building2, GraduationCap, Pencil, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { memo } from "react";

import type { SubjectCardData } from "@/types/timetable";

interface SubjectCardProps {
  data: SubjectCardData;
  selected?: boolean;
  onClick?: () => void;
}

const badgeVariants: Record<string, string> = {
  THEORY: "bg-blue-50 text-blue-700 border-blue-200",
  LAB: "bg-green-50 text-green-700 border-green-200",
  TUTORIAL: "bg-purple-50 text-purple-700 border-purple-200",
  ELECTIVE: "bg-orange-50 text-orange-700 border-orange-200",
};

const borderVariants: Record<string, string> = {
  THEORY: "border-l-blue-500",
  LAB: "border-l-green-500",
  TUTORIAL: "border-l-purple-500",
  ELECTIVE: "border-l-orange-500",
};

export default memo(function SubjectCard({
  data,
  selected = false,
  onClick,
}: SubjectCardProps) {
  // Safe default to uppercase to match definitions
  const typeKey = data.type ? data.type.toUpperCase() : "THEORY";
  
  const hasConflict = data.hasConflict;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        w-full
        min-h-[90px]
        rounded-xl
        border
        border-l-4
        bg-white
        p-3
        text-left
        transition-all
        duration-200
        hover:shadow-md
        hover:-translate-y-[1px]
        ${hasConflict ? 'border-orange-500 border-l-[4px]' : (borderVariants[typeKey] || borderVariants.THEORY)}
        ${
          selected && !hasConflict
            ? "border-blue-400 ring-2 ring-blue-100"
            : !hasConflict
            ? "border-slate-200"
            : ""
        }
      `}
      style={
        hasConflict
          ? {
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(249, 115, 22, 0.03) 10px, rgba(249, 115, 22, 0.03) 20px)",
              backgroundColor: "rgba(255, 247, 237, 0.5)", // faint orange
            }
          : undefined
      }
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3
            className="
              truncate
              text-sm
              font-bold
              text-slate-900
            "
          >
            {data.subjectName}
          </h3>
        </div>

        {hasConflict ? (
          <div className="flex h-5 w-5 items-center justify-center rounded bg-orange-100/50 text-orange-500">
            <AlertTriangle className="h-3 w-3" />
          </div>
        ) : (
          <Badge
            variant="outline"
            className={`text-[9px] uppercase tracking-wider font-semibold ${badgeVariants[typeKey] || badgeVariants.THEORY}`}
          >
            {data.type}
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          {/* Faculty */}
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-slate-500
            "
          >
            <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">
              {data.facultyName}
            </span>
          </div>

          {/* Room */}
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-slate-500
            "
          >
            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">
              {data.roomName}
            </span>
          </div>
        </div>

        {/* Edit Icon */}
        <div className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
          <Pencil className="h-3 w-3" />
        </div>
      </div>
    </button>
  );
});