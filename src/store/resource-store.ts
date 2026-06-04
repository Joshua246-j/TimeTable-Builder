import { create } from "zustand";

export type ResourceTab =
  | "subjects"
  | "faculty"
  | "rooms";

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  hoursPerWeek: number;
  faculty: string;
  type:
    | "theory"
    | "lab"
    | "tutorial"
    | "elective";
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  designation: string;
}

export interface Room {
  id: string;
  name: string;
  block: string;
  capacity: number;
}

interface ResourceState {
  /* -------------------------------- */
  /* Resource Panel UI               */
  /* -------------------------------- */

  activeTab: ResourceTab;

  searchQuery: string;

  /* -------------------------------- */
  /* Resource Data                   */
  /* -------------------------------- */

  subjects: Subject[];

  faculty: Faculty[];

  rooms: Room[];

  /* -------------------------------- */
  /* Selected Resources              */
  /* -------------------------------- */

  selectedSubject: Subject | null;

  selectedFaculty: Faculty | null;

  selectedRoom: Room | null;

  /* -------------------------------- */
  /* Actions                         */
  /* -------------------------------- */

  setActiveTab: (
    tab: ResourceTab
  ) => void;

  setSearchQuery: (
    query: string
  ) => void;

  setSubjects: (
    subjects: Subject[]
  ) => void;

  setFaculty: (
    faculty: Faculty[]
  ) => void;

  setRooms: (
    rooms: Room[]
  ) => void;

  setSelectedSubject: (
    subject: Subject | null
  ) => void;

  setSelectedFaculty: (
    faculty: Faculty | null
  ) => void;

  setSelectedRoom: (
    room: Room | null
  ) => void;

  clearSelection: () => void;

  resetResources: () => void;
}

const initialState = {
  activeTab: "subjects" as ResourceTab,

  searchQuery: "",

  subjects: [],

  faculty: [],

  rooms: [],

  selectedSubject: null,

  selectedFaculty: null,

  selectedRoom: null,
};

export const useResourceStore =
  create<ResourceState>((set) => ({
    ...initialState,

    /* -------------------------------- */
    /* Panel Actions                    */
    /* -------------------------------- */

    setActiveTab: (tab) =>
      set({
        activeTab: tab,
      }),

    setSearchQuery: (query) =>
      set({
        searchQuery: query,
      }),

    /* -------------------------------- */
    /* Data Actions                     */
    /* -------------------------------- */

    setSubjects: (subjects) =>
      set({
        subjects,
      }),

    setFaculty: (faculty) =>
      set({
        faculty,
      }),

    setRooms: (rooms) =>
      set({
        rooms,
      }),

    /* -------------------------------- */
    /* Selection Actions                */
    /* -------------------------------- */

    setSelectedSubject: (subject) =>
      set({
        selectedSubject: subject,
      }),

    setSelectedFaculty: (faculty) =>
      set({
        selectedFaculty: faculty,
      }),

    setSelectedRoom: (room) =>
      set({
        selectedRoom: room,
      }),

    clearSelection: () =>
      set({
        selectedSubject: null,
        selectedFaculty: null,
        selectedRoom: null,
      }),

    resetResources: () =>
      set({
        ...initialState,
      }),
  }));