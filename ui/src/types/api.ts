/* =========================================================
   API TYPES

   Frontend Contract Types

   Used By:
   - Future API Integration
   - Services Layer
   - Zustand Stores
   - Forms
   - Pages

   No Backend Logic
   ========================================================= */

export type ApiStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiState<T = unknown> {
  status: ApiStatus;
  data: T | null;
  error: ApiError | null;
}

export interface SelectOption {
  label: string;
  value: string;
}

export type SemesterOption = SelectOption;

export type DepartmentOption = SelectOption;

export type SectionOption = SelectOption;

export interface SearchParams {
  query: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  semester?: string;
  department?: string;
  section?: string;
}