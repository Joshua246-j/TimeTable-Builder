/* =========================================================
   TIMETABLE CONSTANTS

   Used By:
   - FiltersBar
   - Topbar Selects
   - TimetableGrid
   - Mobile Timetable
   - Zustand Stores

   Based On:
   Current UI Designs
   ========================================================= */

/* =========================================================
   SEMESTERS
   ========================================================= */

export const SEMESTERS = [
  {
    id: "odd-2024-25",
    label: "Odd Sem 2024-25",
    value: "Odd Sem 2024-25",
  },

  {
    id: "even-2024-25",
    label: "Even Sem 2024-25",
    value: "Even Sem 2024-25",
  },
] as const;

/* =========================================================
   DEPARTMENTS
   ========================================================= */

export const DEPARTMENTS = [
  {
    id: "cse",
    label: "CSE Department",
    value: "CSE Department",
  },

  {
    id: "ece",
    label: "ECE Department",
    value: "ECE Department",
  },

  {
    id: "eee",
    label: "EEE Department",
    value: "EEE Department",
  },

  {
    id: "me",
    label: "Mechanical Department",
    value: "Mechanical Department",
  },

  {
    id: "ce",
    label: "Civil Department",
    value: "Civil Department",
  },
] as const;

/* =========================================================
   SECTIONS
   ========================================================= */

export const SECTIONS = [
  {
    id: "va",
    label: "Section V A",
    value: "Section V A",
  },

  {
    id: "vb",
    label: "Section V B",
    value: "Section V B",
  },

  {
    id: "vc",
    label: "Section V C",
    value: "Section V C",
  },
] as const;

/* =========================================================
   WEEK DAYS
   ========================================================= */

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/* =========================================================
   MOBILE DAY SELECTOR
   ========================================================= */

export const MOBILE_DAY_SELECTOR = [
  {
    short: "Mon",
    full: "Monday",
  },

  {
    short: "Tue",
    full: "Tuesday",
  },

  {
    short: "Wed",
    full: "Wednesday",
  },

  {
    short: "Thu",
    full: "Thursday",
  },

  {
    short: "Fri",
    full: "Friday",
  },

  {
    short: "Sat",
    full: "Saturday",
  },
] as const;

/* =========================================================
   TIME SLOTS
   ========================================================= */

export const TIME_SLOTS = [
  {
    id: "1",
    startTime: "09:00",
    endTime: "10:00",
    label: "09:00 - 10:00",
  },

  {
    id: "2",
    startTime: "10:00",
    endTime: "11:00",
    label: "10:00 - 11:00",
  },

  {
    id: "3",
    startTime: "11:00",
    endTime: "12:00",
    label: "11:00 - 12:00",
  },

  {
    id: "4",
    startTime: "12:00",
    endTime: "13:00",
    label: "12:00 - 13:00",
  },

  {
    id: "5",
    startTime: "14:00",
    endTime: "15:00",
    label: "14:00 - 15:00",
  },

  {
    id: "6",
    startTime: "15:00",
    endTime: "16:00",
    label: "15:00 - 16:00",
  },

  {
    id: "7",
    startTime: "16:00",
    endTime: "17:00",
    label: "16:00 - 17:00",
  },
] as const;

/* =========================================================
   LUNCH BREAK
   ========================================================= */

export const LUNCH_BREAK = {
  startTime: "13:00",
  endTime: "14:00",
  label: "Lunch Break",
} as const;

/* =========================================================
   SUBJECT TYPES
   ========================================================= */

export const SUBJECT_TYPES = [
  {
    value: "theory",
    label: "Theory",
  },

  {
    value: "lab",
    label: "Lab",
  },

  {
    value: "tutorial",
    label: "Tutorial",
  },

  {
    value: "elective",
    label: "Elective",
  },
] as const;

/* =========================================================
   STATUS PANEL
   ========================================================= */

export const STATUS_METRICS = [
  {
    id: "optimization",
    label: "Schedule Optimized",
  },

  {
    id: "faculty",
    label: "Faculty Assigned",
  },

  {
    id: "rooms",
    label: "Rooms Assigned",
  },

  {
    id: "conflicts",
    label: "Conflicts",
  },
] as const;

/* =========================================================
   ACTION TOOLBAR
   ========================================================= */

export const ACTIONS = [
  {
    id: "auto-allocate",
    label: "Auto Allocate",
  },

  {
    id: "detect-conflicts",
    label: "Detect Conflicts",
  },

  {
    id: "preview",
    label: "Preview",
  },

  {
    id: "publish",
    label: "Publish",
  },
] as const;