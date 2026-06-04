/* =========================================================
   RESOURCE TYPES
   Used By:
   - resource-store
   - ResourcePanel
   - ResourceCard
   - SubjectList
   - FacultyList
   - RoomList
   - Search
   ========================================================= */

import type { SubjectType } from "./timetable";

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

  facultyId: string;

  facultyName: string;

  type: SubjectType;
}

export interface Faculty {
  id: string;

  name: string;

  employeeId: string;

  department: string;

  designation: string;

  email?: string;

  maxHoursPerWeek?: number;
}

export interface Room {
  id: string;

  name: string;

  block: string;

  floor?: string;

  capacity: number;

  roomType?:
    | "classroom"
    | "lab"
    | "seminar"
    | "auditorium";
}

export interface ResourceSearch {
  query: string;

  activeTab: ResourceTab;
}

export interface ResourcePanelState {
  activeTab: ResourceTab;

  searchQuery: string;

  subjects: Subject[];

  faculty: Faculty[];

  rooms: Room[];
}

export interface ResourceCardBase {
  id: string;

  title: string;

  subtitle?: string;
}

export interface SubjectCardData
  extends ResourceCardBase {
  credits: number;

  hoursPerWeek: number;

  facultyName: string;

  type: SubjectType;
}

export interface FacultyCardData
  extends ResourceCardBase {
  department: string;

  designation: string;
}

export interface RoomCardData
  extends ResourceCardBase {
  block: string;

  capacity: number;
}

export interface ResourceSelection {
  selectedSubject: Subject | null;

  selectedFaculty: Faculty | null;

  selectedRoom: Room | null;
}

export interface ResourcePanelProps {
  activeTab: ResourceTab;
}

export interface ResourceListProps<T> {
  items: T[];

  searchQuery?: string;
}