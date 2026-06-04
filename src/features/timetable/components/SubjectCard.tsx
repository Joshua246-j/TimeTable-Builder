"use client";

import { BookOpen, Building2, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { SubjectCardData } from "@/types/timetable";

interface SubjectCardProps {
  data: SubjectCardData;
  selected?: boolean;
  onClick?: () => void;
}

const badgeVariants = {
  theory:
    "bg-blue-100 text-blue-700 border-blue-200",

  lab:
    "bg-green-100 text-green-700 border-green-200",

  tutorial:
    "bg-purple-100 text-purple-700 border-purple-200",

  elective:
    "bg-orange-100 text-orange-700 border-orange-200",
};

export default function SubjectCard({
  data,
  selected = false,
  onClick,
}: SubjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full
        rounded-xl
        border
        bg-white
        p-3
        text-left
        transition-all
        hover:border-blue-300
        hover:shadow-sm

        ${
          selected
            ? "border-blue-400 ring-2 ring-blue-100"
            : "border-slate-200"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3
            className="
              truncate
              text-sm
              font-semibold
              text-slate-900
            "
          >
            {data.subjectName}
          </h3>
        </div>

        <Badge
          className={
            badgeVariants[data.type]
          }
        >
          {data.type}
        </Badge>
      </div>

      {/* Faculty */}
      <div
        className="
          mt-3
          flex
          items-center
          gap-2
          text-xs
          text-slate-600
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
          mt-2
          flex
          items-center
          gap-2
          text-xs
          text-slate-600
        "
      >
        <Building2 className="h-3.5 w-3.5 flex-shrink-0" />

        <span className="truncate">
          {data.roomName}
        </span>
      </div>

      {/* Subject */}
      <div
        className="
          mt-2
          flex
          items-center
          gap-2
          text-xs
          text-slate-500
        "
      >
        <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />

        <span>
          Assigned Subject
        </span>
      </div>
    </button>
  );
}