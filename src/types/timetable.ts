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

export interface TimetableCell {
  id: string;

  day: WeekDay;

  startTime: string;

  endTime: string;

  assignment?: SubjectAssignment;

  isAssigned: boolean;
}

export interface TimetableRow {
  timeSlot: TimeSlot;

  cells: TimetableCell[];
}

export interface TimetableData {
  semester: string;

  department: string;

  section: string;

  rows: TimetableRow[];
}

export interface TimetableGridProps {
  timetableData: TimetableData;
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