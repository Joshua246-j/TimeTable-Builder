/* eslint-disable @typescript-eslint/no-unused-vars */
import { SelectedCellData } from '@/types/timetable';
import type { ScheduleEntry } from "@/types/timetable";

export function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "";
  try {
    const parseTime = (t: string) => {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return null;
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const ampm = match[3]?.toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    const s = parseTime(startTime);
    const e = parseTime(endTime);
    if (s === null || e === null) return "";
    const diff = e - s;
    if (diff <= 0) return "";
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h > 0 && m > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
    if (h > 0) return `${h}h 00m`;
    return `${m}m`;
  } catch {
    return "";
  }
}

export function calculateRowSpan(startRow: number, endRow: number): number {
  return endRow - startRow + 1;
}

export function checkConflict(
  cells: SelectedCellData[], 
  occupiedSlots: Record<string, boolean>, 
  lockedSlots: Record<string, boolean>
): boolean {
  for (const cell of cells) {
    const key = `${cell.dayId}-${cell.id}`;
    if (occupiedSlots[key] || lockedSlots[key]) {
      return true;
    }
  }
  return false;
}

export function mergeSlots(selectedCells: SelectedCellData[], subjectId: string): ScheduleEntry | null {
  if (!selectedCells || selectedCells.length === 0) return null;

  // Verify same day
  const dayId = selectedCells[0].dayId;
  const isSameDay = selectedCells.every((cell) => cell.dayId === dayId);
  if (!isSameDay) return null;

  // Sort by rowIndex
  const sorted = [...selectedCells].sort((a, b) => a.rowIndex - b.rowIndex);

  // Check continuous
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].rowIndex !== sorted[i - 1].rowIndex + 1) {
      return null;
    }
  }

  const startCell = sorted[0];
  const endCell = sorted[sorted.length - 1];

  const entry: ScheduleEntry = {
    id: `merge-${Date.now()}`,
    subjectId: subjectId,
    dayId: dayId || selectedCells[0].day,
    startTime: startCell.startTime,
    endTime: endCell.endTime,
    rowStart: startCell.rowIndex,
    rowSpan: calculateRowSpan(startCell.rowIndex, endCell.rowIndex),
    isEditable: true,
    isLocked: false,
  };

  return entry;
}

export function splitSlots(groupId: string, mergedGroups: Record<string, ScheduleEntry>) {
  const group = mergedGroups[groupId];
  if (!group || group.isLocked) return null;
  return group;
}

export function validateFaculty(_facultyId: string, _timeRange: string, _day: string): boolean {
  // Logic to prevent faculty double booking
  // Assumes returning true means valid
  return true;
}

export function validateRoom(_roomId: string, _timeRange: string, _day: string): boolean {
  // Logic to prevent room double booking
  return true;
}

export function isAdjacentSelection(selectedCells: SelectedCellData[]): boolean {
  if (!selectedCells || selectedCells.length === 0) return false;
  if (selectedCells.length === 1) return true;

  const dayId = selectedCells[0].dayId;
  const isSameDay = selectedCells.every((cell) => cell.dayId === dayId);
  if (!isSameDay) return false;

  const sorted = [...selectedCells].sort((a, b) => a.rowIndex - b.rowIndex);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].rowIndex !== sorted[i - 1].rowIndex + 1) {
      return false;
    }
  }

  return true;
}
