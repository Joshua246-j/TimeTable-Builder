/* =========================================================
   TIMETABLE TYPES
   Used By:
   - timetable-store
   - FiltersBar
   - TimetableGrid
   - SubjectAllocationPanel
   - Mobile Timetable
   ========================================================= */

export type SubjectType =
  | "theory"
  | "lab"
  | "tutorial"
  | "elective"
  | "seminar"
  | "workshop";

export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface SelectedCellData {
  id: string;
  day: string;
  dayId?: string;
  rowIndex: number;
  startTime: string;
  endTime: string;
  subjectId?: string;
}

export interface Semester {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Section {
  id: string;
  name: string;
}

export interface TimetableFilters {
  semester: string;
  department: string;
  section: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  durationMinutes?: number;
}

export interface SubjectAssignment {
  subjectId: string;
  subjectName: string;

  facultyId: string;
  facultyName: string;

  roomId: string;
  roomName: string;

  type: SubjectType;
}

export interface TimetableCellAssignment {
  subjectId: string;
}

export interface TimetableCell {
  id: string;
  day: string;
  dayId?: string;
  slotId?: string;
  startTime: string;
  endTime: string;
  isAssigned: boolean;
  assignment?: TimetableCellAssignment;
  rowSpan?: number;
  merged?: boolean;
  occupied?: boolean;
  locked?: boolean;
  subjectId?: string;
  mergedGroupId?: string;
  isEditable?: boolean;
}

export interface ScheduleEntry {
  id: string;
  subjectId: string;
  teacherId?: string;
  roomId?: string;
  dayId: string;
  startTime: string;
  endTime: string;
  duration?: number;
  rowSpan: number;
  rowStart: number;
  merged?: boolean;
  isEditable: boolean;
  isLocked: boolean;
}

export interface TimetableDay {
  id: string;
  name: string;
  shortName: string;
}

export interface TimetableTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
}

export interface TimetableData {
  days: TimetableDay[];
  timeSlots: TimetableTimeSlot[];
  subjects: Record<string, SubjectCardData>;
  cells: TimetableCell[];
}

export interface SubjectCardData {
  id: string;
  code?: string;
  credits?: number;
  subjectName: string;
  facultyName: string;
  roomName: string;
  type: string;
  section?: string;
  color?: string;
  notes?: string;
  hasConflict?: boolean;
  isEditable?: boolean;
}

export interface DaySelectorItem {
  label: WeekDay;
  value: WeekDay;
}