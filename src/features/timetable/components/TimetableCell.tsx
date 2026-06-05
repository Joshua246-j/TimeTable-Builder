"use client";

import EmptySlot from "./EmptySlot";
import SubjectCard from "./SubjectCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type {
  SubjectCardData,
  TimetableCell as TimetableCellType,
} from "@/types/timetable";

interface TimetableCellProps {
  cell: TimetableCellType;
  subject?: SubjectCardData;
  selected?: boolean;
  onCellClick?: (cell: TimetableCellType) => void;
  onSubjectClick?: (cell: TimetableCellType) => void;
  onAssignSlot?: (cell: TimetableCellType, subjectId: string) => void;
  availableSubjects?: SubjectCardData[];
}

import { memo } from "react";

export default memo(function TimetableCell({
  cell,
  subject,
  selected = false,
  onCellClick,
  onSubjectClick,
  onAssignSlot,
  availableSubjects = [],
}: TimetableCellProps) {
  const handleClick = () => {
    onCellClick?.(cell);
  };

  const handleSubjectClick = () => {
    onSubjectClick?.(cell);
  };

  return (
    <div
      className="
        min-h-[140px]
        p-2
        relative
        flex
        flex-col
      "
    >
      {cell.isAssigned && subject ? (
        <SubjectCard
          data={subject}
          selected={selected}
          onClick={handleSubjectClick}
        />
      ) : (
        <>
          <EmptySlot
            isSelected={selected}
            onClick={handleClick}
          />
          {selected && onAssignSlot && (
            <div className="absolute inset-0 bg-white/95 flex flex-col justify-center p-2 z-10 rounded-xl border border-blue-200 shadow-sm backdrop-blur-sm animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-bold text-[#0D2463] uppercase tracking-wider">Assign Subject</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Click the cell again to deselect or just let parent handle click
                    if (onCellClick) onCellClick({ ...cell, id: "" });
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <Select
                defaultOpen={true}
                onValueChange={(value) => {
                  if (value) {
                    onAssignSlot(cell, value);
                  }
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs bg-white border-slate-200 shadow-sm focus:ring-[#0D2463]">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {availableSubjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id} className="text-xs py-1.5 cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{sub.subjectName}</span>
                        <span className="text-[9px] text-slate-500 uppercase">{sub.type} • {sub.facultyName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}
    </div>
  );
});