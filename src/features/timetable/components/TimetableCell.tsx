"use client";

import EmptySlot from "./EmptySlot";
import SubjectCard from "./SubjectCard";

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
  onAssignSlot?: (cellId: string, subjectId: string) => void;
  availableSubjects?: SubjectCardData[];
}

export default function TimetableCell({
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
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-2 z-10 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 mb-1">ASSIGN SUBJECT</span>
              <select
                className="w-full border border-slate-200 rounded p-1 text-xs"
                onChange={(e) => {
                  if (e.target.value) {
                    onAssignSlot(cell.id, e.target.value);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Select...</option>
                {availableSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subjectName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
}