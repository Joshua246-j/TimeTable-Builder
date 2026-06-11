"use client";

import DayHeader from "./DayHeader";
import TimetableCell from "./TimetableCell";
import LunchBreakRow from "./LunchBreakRow";
import { memo, useCallback } from "react";

import type {
  SubjectCardData,
  TimetableCell as TimetableCellType,
} from "@/types/timetable";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleCellSelection } from "@/store/selectionSlice";
import { ValidationIssue } from "@/services/validationService";
import SelectionToolbar from "./SelectionToolbar";
import type { SelectedCell } from "@/types/timetableSpan";
import { isOverlap } from "@/lib/timeEngine";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface Day {
  id: string;
  name: string;
  shortName?: string;
}

interface TimetableGridProps {
  days: Day[];
  timeSlots: TimeSlot[];
  cells: TimetableCellType[];
  subjects?: Record<string, SubjectCardData>;
  selectedCellId?: string;
  lunchBreakIndex?: number;
  lunchBreakLabel?: string;
  lunchBreakStartTime?: string;
  lunchBreakEndTime?: string;
  onDaySelect?: (day: string) => void;
  onCellClick?: (cell: TimetableCellType) => void;
  onSubjectClick?: (cell: TimetableCellType) => void;
  onEditTime?: (cell: TimetableCellType) => void;
  onAssignSlot?: (cell: TimetableCellType, subjectId: string) => void;
  editingGroupId?: string | null;
  onCancelEdit?: () => void;
  onSaveEdit?: (subject: SubjectCardData, updatedTime?: {startTime: string; endTime: string}, swappedSubjectId?: string) => void;
}

const BADGE_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  THEORY: { bg: "bg-blue-100/50", border: "border-l-blue-500", text: "text-blue-600", label: "T" },
  LAB: { bg: "bg-green-100/50", border: "border-l-green-500", text: "text-green-600", label: "L" },
  TUTORIAL: { bg: "bg-purple-100/50", border: "border-l-purple-500", text: "text-purple-600", label: "TUT" },
  ELECTIVE: { bg: "bg-orange-100/50", border: "border-l-orange-500", text: "text-orange-600", label: "E" },
};

export default memo(function TimetableGrid({
  days,
  timeSlots,
  cells,
  subjects = {},
  selectedCellId,
  lunchBreakIndex,
  lunchBreakLabel = "LUNCH BREAK",
  lunchBreakStartTime,
  lunchBreakEndTime,
  onDaySelect,
  onCellClick,
  onSubjectClick,
  onEditTime,
  onAssignSlot,
  editingGroupId,
  onCancelEdit,
  onSaveEdit,
}: TimetableGridProps) {
  const dispatch = useDispatch();
  
  const { selectedCells, selectionMode } = useSelector((state: RootState) => state.selection);
  const { mergedAllocations } = useSelector((state: RootState) => state.merge);
  const { lockedAllocations } = useSelector((state: RootState) => state.lock);
  const { conflicts } = useSelector((state: RootState) => state.validation);
  
  const handleToggleCellSelection = useCallback((cell: SelectedCell) => {
    dispatch(toggleCellSelection(cell));
  }, [dispatch]);

  const getCell = useCallback(
    (dayName: string, startTime: string, endTime: string) => {
      return cells.find(
        (c) =>
          c.day === dayName &&
          c.startTime === startTime &&
          c.endTime === endTime
      );
    },
    [cells]
  );

  return (
    <>
      <SelectionToolbar />
      {/* MOBILE TIMELINE VIEW */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* Mobile Date Selector (Example static days as per design) */}
        <div className="flex w-full items-center justify-between overflow-x-auto border-b border-slate-200 bg-white px-2 pt-3">
          {["MON 12", "TUE 13", "WED 14", "THU 15", "FRI 16"].map((day, i) => (
            <div key={i} className="flex flex-col items-center justify-center px-4 cursor-pointer relative pb-2">
              <span className={`text-[10px] font-bold ${i === 0 ? "text-[#0D2463]" : "text-slate-500"}`}>{day.split(" ")[0]}</span>
              <span className={`text-sm font-semibold mt-1 ${i === 0 ? "text-[#0D2463]" : "text-slate-900"}`}>{day.split(" ")[1]}</span>
              {i === 0 && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0D2463]" />}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 text-[10px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Theory</div>
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Lab</div>
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Tutorial</div>
        </div>

        {/* Timeline Items */}
        <div className="flex flex-col gap-4 px-4 pb-20">
          {timeSlots.map((timeSlot, rowIndex) => {
            const day = days[0]?.name || "Monday";
            const cell = getCell(day, timeSlot.startTime, timeSlot.endTime);
            const subject = cell?.assignment ? subjects[cell.assignment.subjectId] : undefined;

            const isLunch = typeof lunchBreakIndex === "number" && lunchBreakIndex === rowIndex;

            return (
              <div key={timeSlot.id} className="flex items-start gap-3">
                <div className="w-[60px] shrink-0 pt-2 text-right text-[10px] font-semibold text-slate-500">
                  {timeSlot.startTime}
                  <div className="text-[9px] text-slate-400 opacity-0">{timeSlot.endTime}</div>
                </div>

                <div className="min-w-0 flex-1">
                  {isLunch ? (
                    <div className="flex items-center justify-center rounded-xl bg-slate-100 py-3 text-[10px] font-bold text-slate-500">
                      ☕ LUNCH BREAK
                    </div>
                  ) : subject ? (
                    <div
                      className={`relative flex w-full flex-col gap-1 rounded-xl border border-slate-200 border-l-[4px] p-3 shadow-sm ${BADGE_STYLES[subject.type]?.bg || BADGE_STYLES.THEORY.bg
                        } ${BADGE_STYLES[subject.type]?.border || BADGE_STYLES.THEORY.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-[#0D2463]">{subject.subjectName}</h4>
                        <span className={`rounded bg-white px-2 py-0.5 text-[9px] font-bold border border-slate-100 ${BADGE_STYLES[subject.type]?.text || BADGE_STYLES.THEORY.text}`}>
                          {BADGE_STYLES[subject.type]?.label || BADGE_STYLES.THEORY.label}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        {subject.facultyName}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {subject.roomName}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[72px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
                      <span className="text-[10px] font-bold text-slate-400">+ ASSIGN</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP GRID VIEW */}
      <div
        className="
          hidden
          flex-col
          h-full
          min-h-0
          overflow-hidden
          rounded-[24px]
          bg-[#F8FAFC]
          shadow-sm
          lg:flex
          border border-slate-200/60
        "
      >


        <div className={`overflow-auto flex-1 ${days.length > 5 ? 'p-2' : 'p-4'}`}>
          <div
            className={`grid ${days.length > 5 ? 'gap-x-[4px] gap-y-[4px]' : 'gap-x-[8px] gap-y-[8px]'}`}
            style={{
              gridTemplateColumns: `repeat(${days.length}, minmax(${days.length > 5 ? '250px' : '280px'}, 1fr))`,
            }}
          >
            {/* Day Headers */}
            {days.map((day) => (
              <DayHeader
                key={day.id}
                day={day.name}
                shortLabel={day.shortName}
                onClick={() => onDaySelect?.(day.name)}
              />
            ))}

            {/* Rows */}
            {timeSlots.map((timeSlot, rowIndex) => (
              <div key={timeSlot.id} className="contents">
                {/* Cells */}
                {days.map((day) => {
                  const cell = getCell(day.name, timeSlot.startTime, timeSlot.endTime);
                  const actualCell = cell || {
                    id: `${day.id}-${timeSlot.id}`,
                    day: day.name,
                    startTime: timeSlot.startTime,
                    endTime: timeSlot.endTime,
                    isAssigned: false,
                  };

                  const subject = actualCell.assignment ? subjects[actualCell.assignment.subjectId] : undefined;


                  const activeGroup = Object.values(mergedAllocations).find((g) => {
                    const isSameDay = g.dayId === day.name || g.dayId === day.id;
                    if (!isSameDay) return false;
                    return isOverlap(
                      { startTime: g.startTime, endTime: g.endTime },
                      { startTime: timeSlot.startTime, endTime: timeSlot.endTime }
                    );
                  });

                  if (activeGroup) {
                    const groupSubject = activeGroup.subjectId ? subjects[activeGroup.subjectId] : undefined;
                    // Check if lockSlice has this id locked, or if the group itself has isLocked true
                    const isGroupLocked = lockedAllocations[activeGroup.id] || activeGroup.isLocked;
                    
                    const groupConflicts = conflicts.filter(c => c.cellIds?.includes(activeGroup.id));
                    const isConflict = groupConflicts.length > 0;
                    
                    if (timeSlot.startTime === activeGroup.startTime) {
                      return (
                        <TimetableCell
                          key={actualCell.id}
                          cell={actualCell}
                          subject={groupSubject || subject}
                          selected={selectedCellId === actualCell.id}
                          onCellClick={onCellClick}
                          onSubjectClick={onSubjectClick}
                          onEditTime={onEditTime}
                          onAssignSlot={onAssignSlot}
                          availableSubjects={Object.values(subjects)}
                          rowIndex={rowIndex}
                          selectionMode={selectionMode}
                          onSelectionToggle={handleToggleCellSelection}
                          rowSpan={activeGroup.rowSpan}
                          mergedGroup={{ ...activeGroup, isLocked: isGroupLocked }}
                          isEditing={editingGroupId === activeGroup.id}
                          onCancelEdit={onCancelEdit}
                          onSaveEdit={onSaveEdit}
                          isConflict={isConflict}
                          conflictData={isConflict ? groupConflicts[0] : undefined}
                        />
                      );
                    } else {
                      return null; // Skip rendering cell if it's covered by a rowSpan
                    }
                  }

                  const isSpanSelected = selectedCells.some((c) => c.id === actualCell.id);

                  const cellConflicts = conflicts.filter(c => c.cellIds?.includes(actualCell.id));
                  const isConflict = cellConflicts.length > 0;

                  return (
                    <TimetableCell
                      key={actualCell.id}
                      cell={actualCell}
                      subject={subject}
                      selected={selectedCellId === actualCell.id}
                      onCellClick={onCellClick}
                      onSubjectClick={onSubjectClick}
                      onEditTime={onEditTime}
                      onAssignSlot={onAssignSlot}
                      availableSubjects={Object.values(subjects)}
                      rowIndex={rowIndex}
                      isSpanSelected={isSpanSelected}
                      selectionMode={selectionMode}
                      onSelectionToggle={handleToggleCellSelection}
                      isEditing={editingGroupId === actualCell.id}
                      onCancelEdit={onCancelEdit}
                      onSaveEdit={onSaveEdit}
                      isConflict={isConflict}
                      conflictData={isConflict ? cellConflicts[0] : undefined}
                    />
                  );
                })}

                {/* Optional Break Row */}
                {typeof lunchBreakIndex === "number" && lunchBreakIndex === rowIndex && (
                  <div style={{ gridColumn: `span ${days.length}` }}>
                    <LunchBreakRow
                      label={lunchBreakLabel}
                      startTime={lunchBreakStartTime}
                      endTime={lunchBreakEndTime}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});