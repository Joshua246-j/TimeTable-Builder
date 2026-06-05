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
  | "elective";

export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

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
  startTime: string;
  endTime: string;
  isAssigned: boolean;
  assignment?: TimetableCellAssignment;
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

  hasConflict?: boolean;
}

export interface DaySelectorItem {
  label: WeekDay;

  value: WeekDay;
}