"use client";

import { Building2, Pencil, User } from "lucide-react";

interface SubjectAllocationCardProps {
  subject: {
    id: string;
    code?: string;
    credits?: number;
    type: string;
    subjectName: string;
    facultyName: string;
    roomName: string;
  };
  onEdit: () => void;
}

export default function SubjectAllocationCard({
  subject,
  onEdit,
}: SubjectAllocationCardProps) {
  const badgeStyles: Record<string, string> = {
    THEORY: "bg-blue-50 text-blue-700",
    LAB: "bg-green-50 text-green-700",
    TUTORIAL: "bg-purple-50 text-purple-700",
    ELECTIVE: "bg-orange-50 text-orange-700",
  };

  return (
    <div
      className="
        rounded-2xl
        border
        border-[#E5E7EB]
        bg-white
        transition-all
        hover:border-slate-300
        hover:shadow-sm
      "
    >
      <div className="p-4">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {subject.code}
              </span>

              <span className="text-[10px] font-semibold text-slate-300">
                •
              </span>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {subject.credits} CREDITS
              </span>

              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  ${badgeStyles[subject.type] || badgeStyles.THEORY}
                `}
              >
                {subject.type}
              </span>
            </div>

            <h3
              className="
                mt-2
                text-lg
                font-bold
                text-slate-900
              "
            >
              {subject.subjectName}
            </h3>
          </div>

          <button
            onClick={onEdit}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-slate-400
              transition
              hover:bg-slate-50
              hover:text-slate-600
            "
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* FACULTY + ROOM */}
        <div
          className="
            mt-5
            grid
            grid-cols-2
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Faculty
            </p>

            <div
              className="
                mt-1.5
                flex
                items-center
                gap-2
                text-[13px]
                text-slate-600
              "
            >
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{subject.facultyName}</span>
            </div>
          </div>

          <div>
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Room
            </p>

            <div
              className="
                mt-1.5
                flex
                items-center
                gap-2
                text-[13px]
                text-slate-600
              "
            >
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate">{subject.roomName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}