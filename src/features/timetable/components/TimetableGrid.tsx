"use client";

import DayHeader from "./DayHeader";
import TimetableCell from "./TimetableCell";
import BreakRow from "./BreakRow";
import { memo, useCallback } from "react";
import { Settings2 } from "lucide-react";

import type {
  SubjectCardData,
  TimetableCell as TimetableCellType,
} from "@/types/timetable";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleCellSelection } from "@/store/timetableEngineSlice";
import { toggleGridEditMode } from "@/store/gridConfigSlice";
import { GridBreak } from "@/store/gridConfigSlice";

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
  isGridEditMode?: boolean;
  breaks?: GridBreak[];
  onDaySelect?: (day: string) => void;
  onCellClick?: (cell: TimetableCellType) => void;
  onSubjectClick?: (cell: TimetableCellType) => void;
  onEditTime?: (cell: TimetableCellType) => void;
  onTimeChange?: (cell: TimetableCellType, newStartTime: string, newEndTime: string) => void;
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
  isGridEditMode = false,
  breaks = [],
  onDaySelect,
  onCellClick,
  onSubjectClick,
  onEditTime,
  onTimeChange,
  onAssignSlot,
  editingGroupId,
  onCancelEdit,
  onSaveEdit,
}: TimetableGridProps) {
  const dispatch = useDispatch();
  
  const { selectedCells, selectionMode, allocations } = useSelector((state: RootState) => state.timetableEngine);
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
          {timeSlots.map((timeSlot) => {
            const day = days[0]?.name || "Monday";
            const cell = getCell(day, timeSlot.startTime, timeSlot.endTime);
            const subject = cell?.assignment ? subjects[cell.assignment.subjectId] : undefined;
            const breakAfterThis = breaks.find(b => b.afterPeriodId === timeSlot.id);

            return (
              <div key={timeSlot.id} className="contents">
              <div className="flex items-start gap-3 w-full">
                <div className="w-[60px] shrink-0 pt-2 text-right text-[10px] font-semibold text-slate-500">
                  {timeSlot.startTime}
                  <div className="text-[9px] text-slate-400 opacity-0">{timeSlot.endTime}</div>
                </div>

                <div className="min-w-0 flex-1">
                  {subject ? (
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
              {breakAfterThis && (
                <div className="w-full mt-4 mb-4">
                  <BreakRow
                    label={breakAfterThis.label}
                    startTime={timeSlot.endTime}
                    endTime={`+${breakAfterThis.durationMinutes}m`}
                    durationMinutes={breakAfterThis.durationMinutes}
                    isGridEditMode={isGridEditMode}
                    onRemove={() => {}}
                  />
                </div>
              )}
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
          relative
        "
      >
        {/* Configure Grid Floating Button */}
        <div className="absolute top-3 right-4 z-20">
          <button
            onClick={() => dispatch(toggleGridEditMode())}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold shadow-md transition-all duration-300 hover:scale-105 active:scale-95 ${
              isGridEditMode
                ? "bg-slate-800 text-white shadow-slate-300/50"
                : "bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-white hover:text-blue-600 hover:shadow-lg hover:border-blue-200"
            }`}
          >
            <Settings2 className={`h-4 w-4 ${isGridEditMode ? "animate-spin-slow text-white" : ""}`} />
            {isGridEditMode ? "Finish Editing" : "Configure Grid"}
          </button>
        </div>

        {/* Grid Content */}
        <div className={`overflow-auto flex-1 ${days.length > 5 ? 'p-2 pt-16' : 'p-4 pt-16'}`}>
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
            {timeSlots.map((timeSlot, rowIndex) => {
              const breakAfterThis = breaks.find(b => b.afterPeriodId === timeSlot.id);
              return (
              <div key={timeSlot.id} className="contents">
                {/* Cells */}
                {days.map((day) => {






                  const allocationsInCell = Object.values(allocations).filter((a) => {
                    const isSameDay = a.dayId === day.name || a.dayId === day.id;
                    if (!isSameDay) return false;
                    return isOverlap(
                      { startTime: a.startTime, endTime: a.endTime },
                      { startTime: timeSlot.startTime, endTime: timeSlot.endTime }
                    );
                  });

                  if (allocationsInCell.length > 0) {
                    // Just take the first one to render, but mark conflict if multiple
                    const allocation = allocationsInCell[0];
                    const allocSubject = allocation.subjectId ? subjects[allocation.subjectId] : undefined;
                    const isLocked = allocation.isLocked;
                    
                    // Check for conflicts
                    const allocConflicts = conflicts.filter(c => c.cellIds?.includes(allocation.id));
                    const isConflict = allocConflicts.length > 0 || allocationsInCell.length > 1;
                    
                    // Calculate how many slots this allocation spans across the whole day
                    const overlappingSlots = timeSlots.filter(t => 
                      isOverlap(
                        { startTime: allocation.startTime, endTime: allocation.endTime }, 
                        { startTime: t.startTime, endTime: t.endTime }
                      )
                    );

                    // Render only in the FIRST slot it overlaps with
                    if (overlappingSlots.length > 0 && timeSlot.startTime === overlappingSlots[0].startTime) {
                      return (
                        <TimetableCell
                          key={allocation.id}
                          cell={{
                            id: allocation.id,
                            day: day.name,
                            startTime: allocation.startTime,
                            endTime: allocation.endTime,
                            isAssigned: true,
                            assignment: { subjectId: allocation.subjectId }
                          }}
                          subject={allocSubject}
                          selected={selectedCellId === allocation.id || selectedCells.some(c => c.id === allocation.id)}
                          onCellClick={onCellClick}
                          onSubjectClick={onSubjectClick}
                          onEditTime={onEditTime}
                          onTimeChange={onTimeChange}
                          onAssignSlot={onAssignSlot}
                          availableSubjects={Object.values(subjects)}
                          rowIndex={rowIndex}
                          selectionMode={selectionMode}
                          onSelectionToggle={handleToggleCellSelection}
                          rowSpan={overlappingSlots.length}
                          mergedGroup={overlappingSlots.length > 1 ? allocation : undefined}
                          isLocked={isLocked}
                          isEditing={editingGroupId === allocation.id}
                          onCancelEdit={onCancelEdit}
                          onSaveEdit={onSaveEdit}
                          isConflict={isConflict}
                          conflictData={allocConflicts[0]}
                        />
                      );
                    } else if (overlappingSlots.length > 0 && timeSlot.startTime !== overlappingSlots[0].startTime) {
                      // Skip rendering this cell because it's covered by the rowSpan of the first cell
                      return null; 
                    } else {
                       // Fallback (shouldn't happen if overlappingSlots > 0)
                       return null;
                    }
                  }

                  // Empty Cell
                  const emptyCellId = `${day.id}-${timeSlot.id}`;
                  const isSpanSelected = selectedCells.some((c) => c.id === emptyCellId);

                  return (
                    <TimetableCell
                      key={emptyCellId}
                      cell={{
                        id: emptyCellId,
                        day: day.name,
                        startTime: timeSlot.startTime,
                        endTime: timeSlot.endTime,
                        isAssigned: false,
                      }}
                      selected={selectedCellId === emptyCellId}
                      onCellClick={onCellClick}
                      onAssignSlot={onAssignSlot}
                      availableSubjects={Object.values(subjects)}
                      rowIndex={rowIndex}
                      isSpanSelected={isSpanSelected}
                      selectionMode={selectionMode}
                      onSelectionToggle={handleToggleCellSelection}
                    />
                  );
                })}

                {/* Optional Break Row */}
                {breakAfterThis && (
                  <div style={{ gridColumn: `span ${days.length}` }} className="my-1">
                    <BreakRow
                      label={breakAfterThis.label}
                      startTime={timeSlot.endTime}
                      endTime={`+${breakAfterThis.durationMinutes}m`}
                      durationMinutes={breakAfterThis.durationMinutes}
                      isGridEditMode={isGridEditMode}
                    />
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>
      </div>
    </>
  );
});