import { create } from "zustand";

export interface TimetableCell {
  id: string;
  day: string;
  startTime: string;
  endTime: string;

  subjectId?: string;
  facultyId?: string;
  roomId?: string;

  type?: "theory" | "lab" | "tutorial" | "elective";

  isAssigned?: boolean;
}

interface TimetableState {
  /* -------------------------------- */
  /* Filters                          */
  /* -------------------------------- */

  selectedSemester: string;
  selectedDepartment: string;
  selectedSection: string;

  /* -------------------------------- */
  /* Timetable Navigation             */
  /* -------------------------------- */

  selectedDay: string;
  selectedTimeSlot: string | null;

  /* -------------------------------- */
  /* Cell Selection                   */
  /* -------------------------------- */

  selectedCell: TimetableCell | null;

  /* -------------------------------- */
  /* Timetable Data                   */
  /* -------------------------------- */

  timetableData: TimetableCell[];

  /* -------------------------------- */
  /* Filter Actions                   */
  /* -------------------------------- */

  setSemester: (semester: string) => void;
  setDepartment: (department: string) => void;
  setSection: (section: string) => void;

  /* -------------------------------- */
  /* Navigation Actions               */
  /* -------------------------------- */

  setSelectedDay: (day: string) => void;
  setSelectedTimeSlot: (slot: string | null) => void;

  /* -------------------------------- */
  /* Cell Actions                     */
  /* -------------------------------- */

  setSelectedCell: (cell: TimetableCell | null) => void;

  /* -------------------------------- */
  /* Timetable Actions                */
  /* -------------------------------- */

  setTimetableData: (data: TimetableCell[]) => void;

  updateCell: (
    cellId: string,
    updates: Partial<TimetableCell>
  ) => void;

  clearTimetable: () => void;

  resetTimetable: () => void;
}

const initialState = {
  selectedSemester: "Odd Sem 2024-25",

  selectedDepartment: "CSE Department",

  selectedSection: "Section V A",

  selectedDay: "Monday",

  selectedTimeSlot: null,

  selectedCell: null,

  timetableData: [],
};

export const useTimetableStore =
  create<TimetableState>((set) => ({
    ...initialState,

    /* -------------------------------- */
    /* Filter Actions                   */
    /* -------------------------------- */

    setSemester: (semester) =>
      set({
        selectedSemester: semester,
      }),

    setDepartment: (department) =>
      set({
        selectedDepartment: department,
      }),

    setSection: (section) =>
      set({
        selectedSection: section,
      }),

    /* -------------------------------- */
    /* Navigation Actions               */
    /* -------------------------------- */

    setSelectedDay: (day) =>
      set({
        selectedDay: day,
      }),

    setSelectedTimeSlot: (slot) =>
      set({
        selectedTimeSlot: slot,
      }),

    /* -------------------------------- */
    /* Cell Actions                     */
    /* -------------------------------- */

    setSelectedCell: (cell) =>
      set({
        selectedCell: cell,
      }),

    /* -------------------------------- */
    /* Timetable Actions                */
    /* -------------------------------- */

    setTimetableData: (data) =>
      set({
        timetableData: data,
      }),

    updateCell: (cellId, updates) =>
      set((state) => ({
        timetableData: state.timetableData.map((cell) =>
          cell.id === cellId
            ? {
                ...cell,
                ...updates,
              }
            : cell
        ),
      })),

    clearTimetable: () =>
      set({
        timetableData: [],
        selectedCell: null,
      }),

    resetTimetable: () =>
      set({
        ...initialState,
      }),
  }));