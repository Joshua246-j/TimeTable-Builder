"use client";

import { memo } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import EmptySlot from "./EmptySlot";
import SubjectClassCard from "./SubjectClassCard";
import TimetableSlotCard from "./TimetableSlotCard";
import SubjectAssignmentEditor from "./SubjectAssignmentEditor";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toggleLockSlot, removeSubjectAssignment, splitMergedPeriod } from "@/store/syntheticActions";

import type {
  SubjectCardData,
  TimetableCell as TimetableCellType,
  ScheduleEntry,
} from "@/types/timetable";
import { ValidationIssue } from "@/services/validationService";

import type { SelectedCell } from "@/types/timetableSpan";

interface TimetableCellProps {
  cell: TimetableCellType;
  subject?: SubjectCardData;
  selected?: boolean;
  onCellClick?: (cell: TimetableCellType) => void;
  onSubjectClick?: (cell: TimetableCellType) => void;
  onEditTime?: (cell: TimetableCellType) => void;
  onAssignSlot?: (cell: TimetableCellType, subjectId: string) => void;
  availableSubjects?: SubjectCardData[];
  rowIndex?: number;
  isSpanSelected?: boolean;
  mergedGroup?: ScheduleEntry;
  onSelectionToggle?: (cell: SelectedCell) => void;
  selectionMode?: boolean;
  rowSpan?: number;
  isLocked?: boolean;
  isConflict?: boolean;
  conflictData?: ValidationIssue;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  onSaveEdit?: (subject: SubjectCardData, updatedTime?: {startTime: string; endTime: string}, swappedSubjectId?: string) => void;
  onTimeChange?: (cell: TimetableCellType, newStartTime: string, newEndTime: string) => void;
  isGridEditMode?: boolean;
}

export default memo(function TimetableCell({
  cell,
  subject,
  selected = false,
  onCellClick,
  onSubjectClick,
  onEditTime,
  onAssignSlot,
  availableSubjects = [],
  rowIndex,
  isSpanSelected = false,
  mergedGroup,
  onSelectionToggle,
  selectionMode = false,
  rowSpan = 1,
  isLocked = false,
  isConflict = false,
  conflictData,
  isEditing = false,
  onCancelEdit,
  onSaveEdit,
  onTimeChange,
  isGridEditMode = false,
}: TimetableCellProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const { setNodeRef, isOver } = useDroppable({
    id: cell.id,
    data: {
      type: "CELL",
      cell,
    },
  });
  
  const { setNodeRef: setDragRef, attributes, listeners, isDragging } = useDraggable({
    id: `drag-${mergedGroup ? mergedGroup.id : cell.id}`,
    data: {
      type: "CELL_ITEM",
      cellId: mergedGroup ? mergedGroup.id : cell.id,
      subjectId: mergedGroup ? mergedGroup.subjectId : cell.assignment?.subjectId,
      rowSpan: rowSpan,
      startTime: mergedGroup ? mergedGroup.startTime : cell.startTime,
      endTime: mergedGroup ? mergedGroup.endTime : cell.endTime,
    },
    disabled: isGridEditMode || (mergedGroup ? (mergedGroup.isLocked || isLocked) : isLocked),
  });

  const handleSlotClick = () => {
    if (isGridEditMode) return;
    if (selectionMode && onSelectionToggle && rowIndex !== undefined) {
      onSelectionToggle({
        id: cell.id,
        day: cell.day,
        startTime: cell.startTime,
        endTime: cell.endTime,
        rowIndex,
        subjectId: cell.assignment?.subjectId,
      });
      return;
    }

    if (cell.isAssigned && subject) {
      // SubjectClassCard handles its own interactions (edit, delete, lock, etc.)
    } else {
      onCellClick?.(cell);
    }
  };

  /* =======================================
     MERGED CARD
  ======================================= */
  if (mergedGroup) {
    return (
      <div 
        ref={isGridEditMode ? undefined : setNodeRef} 
        className={`relative ${isOver && !isGridEditMode ? "ring-2 ring-blue-500 rounded-[10px]" : ""}`} 
        style={{ gridRow: `span ${rowSpan}` }}
      >
        <div 
          ref={isGridEditMode ? undefined : (setDragRef as unknown as React.Ref<HTMLDivElement>)}
          {...attributes} 
          {...listeners}
          className={`h-full ${isDragging ? "opacity-50" : ""}`}
        >
          <TimetableSlotCard
            startTime={mergedGroup.startTime}
            endTime={mergedGroup.endTime}
            rowSpan={rowSpan}
            isSelected={selected || isSpanSelected}
            isLocked={mergedGroup.isLocked || isLocked}
            isSelectionMode={selectionMode}
            onClick={handleSlotClick}
            onTimeChange={(newStart, newEnd) => onTimeChange?.({ ...cell, id: mergedGroup.id, assignment: { subjectId: mergedGroup.subjectId } }, newStart, newEnd)}
          >
            <SubjectClassCard 
              data={subject} 
              scheduleEntry={mergedGroup}
              hasConflict={subject?.hasConflict}
              isLocked={mergedGroup.isLocked || isLocked}
              onToggleLock={isGridEditMode ? undefined : () => {
                dispatch(toggleLockSlot({ id: mergedGroup.id }));
              }}
              onEdit={isGridEditMode ? undefined : () => onEditTime?.({ ...cell, id: mergedGroup.id, assignment: { subjectId: mergedGroup.subjectId } })}
              onDelete={isGridEditMode ? undefined : () => {
                dispatch(removeSubjectAssignment({ cellId: mergedGroup.id }));
              }}
              onSplit={isGridEditMode ? undefined : () => {
                dispatch(splitMergedPeriod({ mergedId: mergedGroup.id }));
              }}
              assignedTime={`${mergedGroup.startTime} - ${mergedGroup.endTime}`}
              assignedDay={mergedGroup.dayId}
            />
          </TimetableSlotCard>
        </div>

        {/* Inline Editor Popup */}
        {isEditing && subject && !isGridEditMode && (
          <div className="absolute inset-x-0 top-0 z-[100] min-w-[300px]">
            <SubjectAssignmentEditor
              subject={subject}
              scheduleEntry={{
                id: mergedGroup.id,
                subjectId: subject.id,
                dayId: mergedGroup.dayId,
                startTime: mergedGroup.startTime,
                endTime: mergedGroup.endTime,
                rowSpan: rowSpan,
                rowStart: 0,
                isEditable: true,
                isLocked: mergedGroup.isLocked || isLocked,
              }}
              onCancel={() => onCancelEdit?.()}
              onSave={(s, t, sw) => onSaveEdit?.(s, t, sw)}
            />
          </div>
        )}
      </div>
    );
  }

  /* =======================================
     NORMAL CELL
  ======================================= */
  return (
    <div ref={isGridEditMode ? undefined : setNodeRef} className={`relative ${isOver && !isGridEditMode ? "ring-2 ring-blue-500 rounded-[10px]" : ""}`} style={{ gridRow: `span ${rowSpan}` }}>
      {cell.isAssigned && subject ? (
        <div 
          ref={isGridEditMode ? undefined : (setDragRef as unknown as React.Ref<HTMLDivElement>)}
          {...attributes} 
          {...listeners}
          className={`h-full ${isDragging ? "opacity-50" : ""}`}
        >
          <TimetableSlotCard
            startTime={cell.startTime}
            endTime={cell.endTime}
            rowSpan={rowSpan}
            isSelected={selected || isSpanSelected}
            isLocked={isLocked}
            isConflict={isConflict}
            isSelectionMode={selectionMode}
            onClick={handleSlotClick}
            onTimeChange={(newStart, newEnd) => onTimeChange?.(cell, newStart, newEnd)}
          >
            <SubjectClassCard 
              data={subject} 
              hasConflict={isConflict}
              conflictData={conflictData}
              isLocked={isLocked}
              onToggleLock={isGridEditMode ? undefined : () => {
                dispatch(toggleLockSlot({ id: cell.id }));
              }}
              onEdit={isGridEditMode ? undefined : () => onEditTime?.(cell)}
              onDelete={isGridEditMode ? undefined : () => onSubjectClick?.(cell)}
              assignedTime={`${cell.startTime} - ${cell.endTime}`}
              assignedDay={cell.day}
            />
          </TimetableSlotCard>
        </div>
      ) : (
        <EmptySlot
          isSelected={selected || isSpanSelected}
          onClick={handleSlotClick}
          startTime={cell.startTime}
          endTime={cell.endTime}
          rowSpan={rowSpan}
        />
      )}

      {/* Assignment Popup overlaying the card */}
      {selected && onAssignSlot && !selectionMode && !cell.isAssigned && !isGridEditMode && (
        <div className="absolute top-0 inset-x-0 z-50 flex flex-col rounded-[10px] border-2 border-blue-400 bg-white shadow-2xl overflow-hidden min-h-[120px] max-h-[300px]">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 border-b border-blue-100 shrink-0">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Assign Subject</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCellClick?.({ ...cell, id: "" });
              }}
              className="text-slate-400 hover:text-red-500 hover:bg-white rounded-md w-6 h-6 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-200 bg-white">
            {availableSubjects.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAssignSlot(cell, sub.id);
                }}
                className="w-full text-left p-2 hover:bg-blue-50 rounded-lg mb-1 border border-transparent hover:border-blue-200 transition-colors flex flex-col gap-1"
              >
                <span className="font-bold text-slate-700 text-[13px] leading-tight line-clamp-2">{sub.subjectName}</span>
                <span className="text-[10px] uppercase text-slate-500 font-semibold truncate">
                  {sub.type} • {sub.facultyName}
                </span>
              </button>
            ))}
            {availableSubjects.length === 0 && (
              <div className="text-xs text-slate-400 p-4 text-center">No subjects available</div>
            )}
          </div>
        </div>
      )}

      {/* Inline Editor Popup for Normal Cell */}
      {isEditing && subject && cell.isAssigned && !isGridEditMode && (
        <div className="absolute inset-x-0 top-0 z-[100] min-w-[300px]">
          <SubjectAssignmentEditor
            subject={subject}
            scheduleEntry={{
              id: cell.id,
              subjectId: subject.id,
              dayId: cell.day,
              startTime: cell.startTime,
              endTime: cell.endTime,
              rowSpan: rowSpan,
              rowStart: 0,
              isEditable: true,
              isLocked: isLocked,
            }}
            onCancel={() => onCancelEdit?.()}
            onSave={(s, t, sw) => onSaveEdit?.(s, t, sw)}
          />
        </div>
      )}
    </div>
  );
});