import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ValidationIssue } from '@/services/validationService';

export interface ValidationState {
  isValid: boolean;
  warnings: ValidationIssue[];
  conflicts: ValidationIssue[];
  lastRunTime: number;
}

const initialState: ValidationState = {
  isValid: true,
  warnings: [],
  conflicts: [],
  lastRunTime: Date.now(),
};

export const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setValidationResults: (state, action: PayloadAction<Omit<ValidationState, 'lastRunTime'>>) => {
      state.isValid = action.payload.isValid;
      state.warnings = action.payload.warnings;
      state.conflicts = action.payload.conflicts;
      state.lastRunTime = Date.now();
    },
    clearValidation: (state) => {
      state.isValid = true;
      state.warnings = [];
      state.conflicts = [];
      state.lastRunTime = Date.now();
    },
  },
});

export const { setValidationResults, clearValidation } = validationSlice.actions;

export default validationSlice.reducer;
