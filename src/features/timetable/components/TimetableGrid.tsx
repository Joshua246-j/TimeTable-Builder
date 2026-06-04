"use client";

import DayHeader from "./DayHeader";
import TimeColumn from "./TimeColumn";
import TimetableCell from "./TimetableCell";
import LunchBreakRow from "./LunchBreakRow";

import type {
  SubjectCardData,
  TimetableCell as TimetableCellType,
} from "@/types/timetable";

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

  subjects?: Record<
    string,
    SubjectCardData
  >;

  selectedCellId?: string;

  lunchBreakIndex?: number;

  lunchBreakLabel?: string;

  lunchBreakStartTime?: string;

  lunchBreakEndTime?: string;

  onDaySelect?: (
    day: string
  ) => void;

  onCellClick?: (
    cell: TimetableCellType
  ) => void;

  onSubjectClick?: (
    cell: TimetableCellType
  ) => void;
}

export default function TimetableGrid({
  days,
  timeSlots,
  cells,
  subjects = {},
  selectedCellId,

  lunchBreakIndex,

  lunchBreakLabel,

  lunchBreakStartTime,

  lunchBreakEndTime,

  onDaySelect,
  onCellClick,
  onSubjectClick,
}: TimetableGridProps) {
  const getCell = (
    day: string,
    startTime: string,
    endTime: string
  ) => {
    return cells.find(
      (cell) =>
        cell.day === day &&
        cell.startTime === startTime &&
        cell.endTime === endTime
    );
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `120px repeat(${days.length}, minmax(180px, 1fr))`,
          }}
        >
          {/* Top Left Corner */}
          <div
            className="
              border-b
              border-r
              border-slate-200
              bg-slate-50
            "
          />

          {/* Day Headers */}
          {days.map((day) => (
            <DayHeader
              key={day.id}
              day={day.name}
              shortLabel={day.shortName}
              onClick={() =>
                onDaySelect?.(day.name)
              }
            />
          ))}

          {/* Rows */}
          {timeSlots.map(
            (timeSlot, rowIndex) => (
              <div
                key={timeSlot.id}
                className="contents"
              >
                {/* Time Column */}
                <TimeColumn
                  startTime={
                    timeSlot.startTime
                  }
                  endTime={
                    timeSlot.endTime
                  }
                />

                {/* Cells */}
                {days.map((day) => {
                  const cell =
                    getCell(
                      day.name,
                      timeSlot.startTime,
                      timeSlot.endTime
                    );

                  if (!cell) {
                    return (
                      <div
                        key={`${day.id}-${timeSlot.id}`}
                        className="
                          min-h-[88px]
                          border-b
                          border-r
                          border-slate-200
                          bg-white
                        "
                      />
                    );
                  }

                  const subject =
                    cell.assignment
                      ? subjects[
                          cell.assignment
                            .subjectId
                        ]
                      : undefined;

                  return (
                    <TimetableCell
                      key={cell.id}
                      cell={cell}
                      subject={subject}
                      selected={
                        selectedCellId ===
                        cell.id
                      }
                      onCellClick={
                        onCellClick
                      }
                      onSubjectClick={
                        onSubjectClick
                      }
                    />
                  );
                })}

                {/* Optional Break Row */}
                {typeof lunchBreakIndex ===
                  "number" &&
                  lunchBreakIndex ===
                    rowIndex && (
                    <>
                      <div
                        className="
                          border-r
                          border-slate-200
                        "
                      >
                        <TimeColumn
                          startTime={
                            lunchBreakStartTime ||
                            ""
                          }
                          endTime={
                            lunchBreakEndTime ||
                            ""
                          }
                          isLunchBreak
                        />
                      </div>

                      <div
                        style={{
                          gridColumn: `span ${days.length}`,
                        }}
                      >
                        <LunchBreakRow
                          label={
                            lunchBreakLabel
                          }
                          startTime={
                            lunchBreakStartTime
                          }
                          endTime={
                            lunchBreakEndTime
                          }
                        />
                      </div>
                    </>
                  )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}