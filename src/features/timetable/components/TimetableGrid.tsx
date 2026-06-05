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

  onAssignSlot?: (
    cellId: string,
    subjectId: string
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
  onAssignSlot,
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
    <>
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
            // For mobile, just show one day's schedule (e.g., first day)
            const day = days[0]?.name || "Monday";
            const cell = getCell(day, timeSlot.startTime, timeSlot.endTime);
            const subject = cell?.assignment ? subjects[cell.assignment.subjectId] : undefined;

            const badgeStyles: Record<string, any> = {
              THEORY: { bg: "bg-blue-100/50", border: "border-l-blue-500", text: "text-blue-600", label: "T" },
              LAB: { bg: "bg-green-100/50", border: "border-l-green-500", text: "text-green-600", label: "L" },
              TUTORIAL: { bg: "bg-purple-100/50", border: "border-l-purple-500", text: "text-purple-600", label: "TUT" },
              ELECTIVE: { bg: "bg-orange-100/50", border: "border-l-orange-500", text: "text-orange-600", label: "E" },
            };

            const isLunch = typeof lunchBreakIndex === "number" && lunchBreakIndex === rowIndex;

            return (
              <div key={timeSlot.id} className="flex items-start gap-3">
                {/* Time */}
                <div className="w-[60px] shrink-0 pt-2 text-right text-[10px] font-semibold text-slate-500">
                  {timeSlot.startTime}
                  <div className="text-[9px] text-slate-400 opacity-0">{timeSlot.endTime}</div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {isLunch ? (
                    <div className="flex items-center justify-center rounded-xl bg-slate-100 py-3 text-[10px] font-bold text-slate-500">
                      ☕ LUNCH BREAK
                    </div>
                  ) : subject ? (
                    <div
                      className={`relative flex w-full flex-col gap-1 rounded-xl border border-slate-200 border-l-[4px] p-3 shadow-sm ${
                        badgeStyles[subject.type]?.bg || badgeStyles.THEORY.bg
                      } ${badgeStyles[subject.type]?.border || badgeStyles.THEORY.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-[#0D2463]">{subject.name}</h4>
                        <span className={`rounded bg-white px-2 py-0.5 text-[9px] font-bold border border-slate-100 ${badgeStyles[subject.type]?.text || badgeStyles.THEORY.text}`}>
                          {badgeStyles[subject.type]?.label || badgeStyles.THEORY.label}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {subject.faculty}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {subject.room}
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
          overflow-hidden
          rounded-2xl
          border
          border-slate-100
          bg-white
          shadow-[0px_4px_24px_rgba(0,0,0,0.02)]
          lg:flex
        "
      >
        {/* Grid Header & Legend */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-md border border-slate-200 p-1.5 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-900">Section CSE V A</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              THEORY
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              LAB
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              TUTORIAL
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              ELECTIVE
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `120px repeat(${days.length}, minmax(280px, 1fr))`,
            }}
          >
            <div
              className="
                bg-transparent
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

                    const actualCell = cell || {
                      id: `${day.id}-${timeSlot.id}`,
                      day: day.name,
                      startTime: timeSlot.startTime,
                      endTime: timeSlot.endTime,
                      isAssigned: false,
                    };

                    const subject =
                      actualCell.assignment
                        ? subjects[
                            actualCell.assignment
                              .subjectId
                          ]
                        : undefined;

                    return (
                      <TimetableCell
                        key={actualCell.id}
                        cell={actualCell}
                        subject={subject}
                        selected={
                          selectedCellId ===
                          actualCell.id
                        }
                        onCellClick={
                          onCellClick
                        }
                        onSubjectClick={
                          onSubjectClick
                        }
                        onAssignSlot={
                          onAssignSlot
                        }
                        availableSubjects={
                          Object.values(subjects)
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
                            bg-transparent
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
    </>
  );
}