import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleEntry } from '@/types/timetable';

export interface MergeState {
  mergedAllocations: Record<string, ScheduleEntry>;
}

const initialState: MergeState = {
  mergedAllocations: {},
};

export const mergeSlice = createSlice({
  name: 'merge',
  initialState,
  reducers: {
    createMergedAllocation: (state, action: PayloadAction<ScheduleEntry>) => {
      const entry = action.payload;
      state.mergedAllocations[entry.id] = entry;
    },
    updateMergedAllocation: (state, action: PayloadAction<{ id: string; updates: Partial<ScheduleEntry> }>) => {
      const { id, updates } = action.payload;
      if (state.mergedAllocations[id]) {
        state.mergedAllocations[id] = { ...state.mergedAllocations[id], ...updates };
      }
    },
    deleteMergedAllocation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.mergedAllocations[id];
    },
    splitMergedAllocation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.mergedAllocations[id];
    },
  },
});

export const {
  createMergedAllocation,
  updateMergedAllocation,
  deleteMergedAllocation,
  splitMergedAllocation,
} = mergeSlice.actions;

export default mergeSlice.reducer;
