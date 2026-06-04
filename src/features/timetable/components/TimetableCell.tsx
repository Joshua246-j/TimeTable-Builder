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

  onCellClick?: (
    cell: TimetableCellType
  ) => void;

  onSubjectClick?: (
    cell: TimetableCellType
  ) => void;
}

export default function TimetableCell({
  cell,
  subject,
  selected = false,
  onCellClick,
  onSubjectClick,
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
        min-h-[88px]
        border-b
        border-r
        border-slate-200
        bg-white
        p-2
      "
    >
      {cell.isAssigned && subject ? (
        <SubjectCard
          data={subject}
          selected={selected}
          onClick={handleSubjectClick}
        />
      ) : (
        <EmptySlot
          isSelected={selected}
          onClick={handleClick}
        />
      )}
    </div>
  );
}