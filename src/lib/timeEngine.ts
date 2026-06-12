import { SelectedCellData } from '@/types/timetable';
import type { ScheduleEntry } from "@/types/timetable";

export interface TimeSlotData {
  startTime: string; // e.g., "09:00 AM"
  endTime: string;   // e.g., "10:00 AM"
}

/**
 * Parses a time string (e.g., "09:00 AM" or "14:30") into minutes from midnight.
 * Example: "09:00 AM" -> 540
 */
export function parseTime(timeStr: string): number {
  if (!timeStr) return 0;
  
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3]?.toUpperCase();

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Formats minutes from midnight back to a time string like "09:00 AM" using Intl.DateTimeFormat.
 */
export function formatTime(minutesFromMidnight: number, locale = "en-US"): string {
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  
  return formatter.format(date).toUpperCase().replace(/\u202F/g, ' '); 
}

/**
 * Compares two time strings.
 * Returns negative if timeA is before timeB, positive if timeA is after timeB, 0 if equal.
 */
export function compareTimes(timeA: string | number, timeB: string | number): number {
  const minsA = typeof timeA === 'string' ? parseTime(timeA) : timeA;
  const minsB = typeof timeB === 'string' ? parseTime(timeB) : timeB;
  return minsA - minsB;
}

// Alias for backward compatibility
export function compareTimeSlots(timeA: string, timeB: string): number {
  return compareTimes(timeA, timeB);
}

/**
 * Calculates the duration between two time strings in minutes.
 */
export function calculateDurationMinutes(startTime: string, endTime: string): number {
  const startMins = parseTime(startTime);
  let endMins = parseTime(endTime);
  
  if (endMins <= startMins) {
    endMins += 24 * 60; // Handle overnight
  }
  
  return endMins - startMins;
}

/**
 * Formats a duration in minutes to a human readable string.
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

/**
 * Calculates the end time given a start time and duration in minutes.
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMins = parseTime(startTime);
  return formatTime(startMins + durationMinutes);
}

/**
 * Calculates how many grid rows a duration spans.
 */
export function calculateRowSpan(durationMinutes: number, slotIntervalMinutes: number = 60): number {
  if (slotIntervalMinutes <= 0) return 1;
  return Math.max(1, Math.round(durationMinutes / slotIntervalMinutes));
}

/**
 * Checks if two time slots overlap based strictly on minutes.
 */
export function isOverlap(slot1: TimeSlotData, slot2: TimeSlotData): boolean {
  const s1 = parseTime(slot1.startTime);
  const e1 = parseTime(slot1.endTime);
  const s2 = parseTime(slot2.startTime);
  const e2 = parseTime(slot2.endTime);
  
  return s1 < e2 && s2 < e1;
}

// Alias for backward compatibility
export function isTimeOverlap(slot1: TimeSlotData, slot2: TimeSlotData): boolean {
  return isOverlap(slot1, slot2);
}

/**
 * Checks if two time slots are exactly adjacent.
 */
export function isAdjacentSlot(slot1: TimeSlotData, slot2: TimeSlotData): boolean {
  const s1 = parseTime(slot1.startTime);
  const e1 = parseTime(slot1.endTime);
  const s2 = parseTime(slot2.startTime);
  const e2 = parseTime(slot2.endTime);

  return e1 === s2 || e2 === s1;
}

/**
 * Sorts allocations chronologically by start time.
 */
export function sortAllocations<T extends { startTime: string }>(allocations: T[]): T[] {
  return [...allocations].sort((a, b) => compareTimes(a.startTime, b.startTime));
}

/**
 * Creates a merged duration spanning multiple time slots.
 */
export function createMergedDuration(slots: TimeSlotData[]): TimeSlotData {
  if (slots.length === 0) throw new Error("Cannot merge empty slots array");
  if (slots.length === 1) return slots[0];

  const sorted = sortAllocations(slots);
  
  return {
    startTime: sorted[0].startTime,
    endTime: sorted[sorted.length - 1].endTime,
  };
}

export function splitSlots(groupId: string, mergedGroups: Record<string, ScheduleEntry>) {
  const group = mergedGroups[groupId];
  if (!group || group.isLocked) return null;
  return group;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateFaculty(_facultyId: string, _timeRange: string, _day: string): boolean {
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateRoom(_roomId: string, _timeRange: string, _day: string): boolean {
  return true;
}

export function isAdjacentSelection(selectedCells: SelectedCellData[]): boolean {
  if (!selectedCells || selectedCells.length === 0) return false;
  if (selectedCells.length === 1) return true;

  const dayId = selectedCells[0].dayId;
  const isSameDay = selectedCells.every((cell) => cell.dayId === dayId);
  if (!isSameDay) return false;

  const sorted = sortAllocations(selectedCells);
  for (let i = 1; i < sorted.length; i++) {
    if (!isAdjacentSlot(sorted[i - 1], sorted[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Recalculates sequential start and end times given an initial start time and an array of ordered durations.
 * Useful for grid configuration mode when inserting breaks or changing period durations.
 */
export function recalculateSequentialTimes(
  initialStartTime: string,
  items: { id: string; durationMinutes: number }[]
): { id: string; startTime: string; endTime: string; durationMinutes: number }[] {
  let currentMins = parseTime(initialStartTime);
  return items.map(item => {
    const startMins = currentMins;
    const endMins = currentMins + item.durationMinutes;
    currentMins = endMins;
    return {
      id: item.id,
      durationMinutes: item.durationMinutes,
      startTime: formatTime(startMins),
      endTime: formatTime(endMins)
    };
  });
}
