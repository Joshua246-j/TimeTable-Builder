/* eslint-disable @typescript-eslint/no-unused-vars */
export interface ValidationIssue {
  id: string;
  type: "conflict" | "warning";
  code: string;
  message: string;
  cellIds?: string[]; // The cells involved in the conflict
  subjectId?: string;
  autoFixAction?: string;
  conflictType?: 'Faculty Conflict' | 'Room Conflict' | 'Section Conflict' | 'Merge Conflict' | 'Manual Edit Conflict';
  affectedSubject?: string;
  affectedTeacher?: string;
  affectedRoom?: string;
  affectedTime?: string;
}

export interface ValidationResult {
  isValid: boolean;
  conflicts: ValidationIssue[];
  warnings: ValidationIssue[];
  lastRunTime: number;
}

export const validationService = {
  async validateSchedule(_stateData: unknown): Promise<ValidationResult> {
    // In a real app, this would send the entire current schedule to the backend for validation.
    // We will build a pure function validation engine locally for the frontend in liveValidationEngine.ts
    // This service acts as a placeholder for a future backend hook.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isValid: true,
          conflicts: [],
          warnings: [],
          lastRunTime: Date.now()
        });
      }, 200);
    });
  }
};
